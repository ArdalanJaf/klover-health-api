const stripe = require("stripe")(
  "sk_test_51LkVjTGLHUbhQyEk1tH4h3AO1vgnqePCKRryJhrk52uCDsaoUahUSqsgCunwrCmNtw42HbsGNna8eodeNMDPSvEO00ZT4DuotR"
);

stripe.products
  .create({
    name: "Pre-Assesment",
    description:
      "Consultation - price is deducted from assesment if you move forward",
  })
  .then((product) => {
    stripe.prices
      .create({
        unit_amount: 1,
        currency: "gbp",
        recurring: {
          interval: "month",
        },
        product: product.id,
      })
      .then((price) => {
        console.log(
          "Success! Here is your starter subscription product id: " + product.id
        );
        console.log(
          "Success! Here is your premium subscription price id: " + price.id
        );
      });
  });
