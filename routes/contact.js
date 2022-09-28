const queries = require("../mySQL/queries.js");
const pConnection = require("../mySQL/connection.js");
const express = require("express");
const isJoiErrors = require("../joiValidator.js");
const router = express.Router();
module.exports = router;
const sendEmail = require("../email/nodeMailer");

router.post("/", async (req, res) => {
  console.log("recieved");

  try {
    const isJoiErrorsResults = await isJoiErrors(req.body);
    if (isJoiErrorsResults === false) {
      const { email, name, message } = req.body;

      const results = await pConnection(queries.getAdminContact());
      const clientEmail = results[0].email;

      await sendEmail(clientEmail, name, email, message);

      // 3. Tell front-end it worked.
      res.send({ status: 1 });
    } else {
      // Send validation-errors to front-end.
      res.send({ status: 1, joiErrors: isJoiErrorsResults });
    }
  } catch (error) {
    console.log("failed");
    res.send({ status: 0 });
  }
});
