const express = require("express");
const router = express.Router();
module.exports = router;
const queries = require("../mySQL/queries.js");
const queriesCoupon = require("../mySQL/queriesCoupon");
const pConnection = require("../mySQL/connection.js");
const isJoiErrors = require("../joiValidator.js");
const bodyParser = require("body-parser");
const createCouponCode = require("../util/createCouponCode");
const sendEmail = require("../email/nodeMailer");
const middleware = require("../middleware");
const res = require("express/lib/response.js");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
// const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;
const endpointSecret =
  "whsec_62a7963244bea5da65149d496175dc9fed11d576f0662cb9441b35df5bbac5c2";

router.post("/check_coupon", bodyParser.json(), async (req, res) => {
  const { couponCode } = req.body;
  console.log("checking coupon", couponCode);

  try {
    // check coupon
    async function couponCheck(couponCode) {
      let couponCheck = await pConnection(queriesCoupon.getCoupon(couponCode));

      if (!couponCheck.length) {
        return { couponError: "Discount code is invalid" };
      } else if (couponCheck[0].redeemed > 0) {
        return { couponError: "Discount code has already been redeemed" };
      } else {
        return { discount: couponCheck[0].amount };
      }
    }

    let result = await couponCheck(couponCode);
    // returns {couponError: ""} or {couponDiscount: 111}
    console.log(result);

    res.send({ status: 1, ...result });
  } catch (error) {
    console.log(error);
    res.send({ status: 0, error });
  }
});

// process payments from website
router.post("/create-payment-intent", bodyParser.json(), async (req, res) => {
  let { productId, firstName, lastName, email, phone, timeslot, couponCode } =
    req.body;
  console.log("request for payment intent creation");
  // console.log(req.body);
  try {
    // validate user information
    let validationErrors = {};
    validationErrors = await isJoiErrors.checkout({
      firstName,
      lastName,
      email,
      phone,
    });
    if (timeslot < 1)
      validationErrors["timeslot"] = "Select an appointment slot";

    // IF VALIDATION FAILS
    if (Object.entries(validationErrors).length > 0) {
      // SEND BACK ERRORS

      res.send({ status: 1, validationErrors });
    } else {
      // GET PRICE
      const prices = await pConnection(queries.getPrices());
      let price =
        productId === 1 ? prices[0].assessment : prices[0].pre_assessment;

      // DEDUCT COUPON DISCOUNT
      if (couponCode.length && productId === 1) {
        let couponInfo = await pConnection(queriesCoupon.getCoupon(couponCode));
        // if coupon is valid, deduct price, else make sure couponCode is null
        couponInfo.length ? (price -= couponInfo[0].amount) : (couponCode = "");
      } else {
        couponCode = "";
      }

      // CREATE PAYMENT INTENT
      const paymentIntent = await stripe.paymentIntents.create({
        amount: price, //sql call to grab price depending on item
        currency: "gbp",
        automatic_payment_methods: {
          enabled: true,
        },
        receipt_email: email,
        metadata: { ...req.body },
      });

      res.send({
        status: 1,
        clientSecret: paymentIntent.client_secret,
      });
    }
  } catch (error) {
    console.log(error);
    res.send({ status: 0, error });
  }
});

// create payment link
router.post(
  "/create-payment-link",
  middleware.validateToken,
  bodyParser.json(),
  async (req, res) => {
    const productId = process.env.STRIPE_PAYMENT_LINK_PRODUCT_ID;

    try {
      const price = await stripe.prices.create({
        currency: "gbp",
        unit_amount: req.body.amount,
        product: productId,
        metadata: { productId: productId },
      });

      const paymentLink = await stripe.paymentLinks.create({
        line_items: [{ price: price.id, quantity: 1 }],
      });

      res.send({ status: 1, url: paymentLink.url });
    } catch (error) {
      console.log(error);
      res.send({ status: 0, error });
    }
  }
);

// listen for payment confirmation from stripe
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    let event = req.body;
    try {
      // confirm stripe endpoint secret
      if (endpointSecret) {
        // Get the signature sent by Stripe
        const signature = req.headers["stripe-signature"];
        try {
          event = stripe.webhooks.constructEvent(
            req.body,
            signature,
            endpointSecret
          );
        } catch (err) {
          console.log(
            `⚠️  Webhook signature verification failed.`,
            err.message
          );
          return res.sendStatus(400);
        }
      }

      // Handle the event (create/redeem coupon, make timeslot unavailable, send confirmation emails)
      if (event.type === "payment_intent.succeeded") {
        const paymentIntent = event.data.object;
        if (Object.entries(paymentIntent.metadata).length < 1) {
          // for pay link payments
          await handlePayLinkPaymentIntentSucceeded(paymentIntent);
        } else {
          // for site purchase payments
          await handlePaymentIntentSucceeded(paymentIntent);
        }
        console.log(
          `PaymentIntent for ${paymentIntent.amount} was successful!`
        );
      } else {
        console.log(`Unhandled event type ${event.type}.`);
      }

      res.sendStatus(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(400);
    }
  }
);

const handlePaymentIntentSucceeded = async (paymentIntent) => {
  //stripe metadata turns all values to strings
  paymentIntent.metadata.productId = Number(paymentIntent.metadata.productId);
  paymentIntent.metadata.timeslot = Number(paymentIntent.metadata.timeslot);
  let { productId, firstName, lastName, email, phone, timeslot, couponCode } =
    paymentIntent.metadata;

  console.log("HANDLING PAYMENT-INTENT-SUCCESS EVENT");
  try {
    // COUPON
    // if pre-assessment, create coupon code.
    let newCCode = "";
    if (productId === 2) {
      newCCode = createCouponCode(lastName, 9);
      await pConnection(
        queriesCoupon.addCoupon(newCCode, paymentIntent.amount)
      );
      paymentIntent.metadata.couponCode = newCCode;
      console.log("coupon created");
    }
    // if assessment + coupon used, redeem coupon
    if (productId === 1 && couponCode.length) {
      await pConnection(queriesCoupon.redeemCoupon(couponCode));
      console.log("coupon redeemed");
    }

    // ADD TIMESLOT TO UNAVAILABILITY
    await pConnection(queries.addUnavailability({ type: 0, time: timeslot }));

    // SEND CONFIRMATION EMAIL TO RICHA + CLIENT
    await sendEmail("booking-richa", {
      ...paymentIntent.metadata,
      amount: paymentIntent.amount,
    });

    await sendEmail("booking-client", {
      ...paymentIntent.metadata,
      amount: paymentIntent.amount,
    });
  } catch (error) {
    console.log(error);
    return error;
  }
};

const handlePayLinkPaymentIntentSucceeded = async (paymentIntent) => {
  console.log("HANDLING PAYMENT-LINK-PAYMENT-INTENT-SUCCESS EVENT");
  try {
    // SEND CONFIRMATION EMAIL TO RICHA
    await sendEmail("pay-link-confirmation", {
      clientEmail: paymentIntent.receipt_email,
      amount: paymentIntent.amount,
    });
  } catch (error) {
    console.log(error);
    return error;
  }
};
