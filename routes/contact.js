const express = require("express");
const router = express.Router();
module.exports = router;
const isJoiErrors = require("../joiValidator.js");
const sendEmail = require("../email/nodeMailer");

router.post("/", async (req, res) => {
  console.log("recieved");
  try {
    const joiErrors = await isJoiErrors.contact(req.body);
    if (Object.entries(joiErrors).length > 0) {
      // Send validation-errors to front-end.
      res.send({ status: 1, joiErrors });
    } else {
      //send email
      const { email, name, message } = req.body;

      await sendEmail("contact", {
        name,
        email,
        message,
      });

      res.send({ status: 1 });
    }
  } catch (error) {
    console.log(error);
    res.send({ status: 0, error });
  }
});
