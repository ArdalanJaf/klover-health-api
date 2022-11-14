const express = require("express");
const router = express.Router();
const queries = require("../mySQL/queries.js");
const pConnection = require("../mySQL/connection.js");
const Stripe = require("stripe");
module.exports = router;
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const products = require("../stripe/products");
const bodyParser = require("body-parser");
const sendEmail = require("../email/nodeMailer");
const numToPrice = require("../util/numToPrice");
const emcaToString = require("../util/emcaToString");

router.post("/payment", async (req, res) => {
  console.log("to");
  try {
    const payload = req.body;
    let product = {};

    // make sure valid productId has been sent
    if (
      payload.productId !== 1 &&
      payload.productId !== 2 &&
      typeof payload.timeslot !== "number"
    )
      return null;

    const prices = await pConnection(queries.getAdminPrices());

    // product = payload.productId === 1 ? products.assessment : products.pre_assessment;

    if (payload.productId === 1) {
      product = products.assessment;
      product.price = prices[0].assessment;
    } else {
      product = products.pre_assessment;
      product.price = prices[0].pre_assessment;
    }
    // console.log(product);

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            unit_amount: product.price,
            currency: "gbp",
            product_data: {
              name: product.name,
              description: product.description(payload.timeslot),
              // customer_details:
              // customer_email
            },
          },
          quantity: 1,
        },
      ],
      // phone_number_collection: {
      //   enabled: true,
      // },
      metadata: {
        timeslot: payload.timeslot,
        name: payload.name,
        product: payload.productId === 1 ? "Full-Assessment" : "Pre-Assessment",
      },
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}`,
      cancel_url: `${process.env.CLIENT_URL}#products`,
      discounts:
        payload.couponId.length > 0
          ? [
              {
                coupon: payload.couponId,
              },
            ]
          : [],
    });

    console.log(session);

    res.send({ status: 1, url: session.url });
  } catch (error) {
    console.log(error);
    res.send({ status: 0, error });
  }
});

// bodyParser.raw({ type: "application/json" }),

// stripe webhook for succesful payment
router.post("/webhook", async (request, response) => {
  const payload = request.body;

  switch (payload.type) {
    case "checkout.session.completed":
      // console.log(payload);
      // console.log(payload.data.object.customer_details);

      const { amount_total, customer_details, metadata } = payload.data.object;
      const isPreAssessment = metadata.product === "Pre-Assessment";

      const couponId = randomCodeGen();

      // if pre-assessment purchased, create coupon
      if (isPreAssessment) {
        console.log("pre-assessment");
        // const couponId = randomCodeGen();
        const prices = await pConnection(queries.getAdminPrices());
        const discount = prices[0].pre_assessment;
        const expireDate = (noOfMonths, startTime) => {
          let date = new Date(startTime);
          date.setMonth(date.getMonth() + noOfMonths);
          return Number(date.getTime()) / 1000;
        };

        const coupon = await stripe.coupons.create({
          id: couponId,
          amount_off: discount,
          max_redemptions: 1,
          currency: "gbp",
          redeem_by: expireDate(12, Number(metadata.timeslot)),
        });
        console.log("COUPON");
        console.log(coupon);
      }

      // email confirmation to Richa
      await sendEmail("booking", {
        product: metadata.product,
        amount: numToPrice(amount_total),
        time: emcaToString(Number(metadata.timeslot)),
        custName: metadata.name,
        custEmail: customer_details.email,
        custPhone: customer_details.phone,
        couponId: isPreAssessment ? couponId : null,
      });

      // add timeslot to exception
      await pConnection(
        queries.addException({
          type: 0,
          time: Number(metadata.timeslot),
          date_range_end: null,
        })
      );

      break;

    // send invoice to user
    // send invoice to customer (if pre-assesment-send code)

    case "payment_intent.succeeded":
      console.log("sent the monies!");
      // Then define and call a function to handle the event payment_intent.succeeded
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${payload.type}`);
  }

  response.status(200);
});

let randomCodeGen = () => {
  let s4 = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  };
  //return id of format 'aaaaaaaa'-'aaaa'-'aaaa'-'aaaa'-'aaaaaaaaaaaa'
  return (
    s4() +
    s4() +
    "-" +
    s4() +
    "-" +
    s4() +
    "-" +
    s4() +
    "-" +
    s4() +
    s4() +
    s4()
  );
};
