const express = require("express");
const router = express.Router();
const Stripe = require("stripe");
module.exports = router;
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/payment", async (req, res) => {
  console.log("to");
  try {
    const line_items = {
      price_data: {
        currency: "gbp",
        product_data: {
          name: "T-shirt", //name
          description: "",
          timeSlot: "",
        },
        unit_amount: 2000, //price get from DB?
      },
      quantity: 1,
    };

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "gbp",
            product_data: {
              name: "T-shirt",
            },
            unit_amount: 2000,
          },
          quantity: 1,
        },
      ],
      phone_number_collection: {
        enabled: true,
      },
      // invoice email? Coupon..
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}success`,
      cancel_url: `${process.env.CLIENT_URL}cancel`,
    });
    console.log(session);
    res.send({ status: 1, url: session.url });
  } catch (error) {
    res.send({ status: 0, error });
  }
});
