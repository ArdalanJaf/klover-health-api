const express = require("express");
const router = express.Router();
module.exports = router;
const isJoiErrors = require("../joiValidator.js");
const sendEmail = require("../email/nodeMailer");

router.post("/", async (req, res) => {
  console.log("recieved");
  try {
    const contactErrors = await isJoiErrors.contact(req.body);

    if (Object.entries(contactErrors).length > 0) {
      // Send validation-errors to front-end.
      res.send({ status: 1, contactErrors });
    } else {
      //send email
      const { email, name, tel, message } = req.body;

      await sendEmail("contact", {
        name,
        email,
        tel,
        message,
      });

      res.send({ status: 1 });
    }
  } catch (error) {
    console.log(error);
    res.send({ status: 0, error });
  }
});
