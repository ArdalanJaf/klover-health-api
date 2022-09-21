const queries = require("./mySQL/queries.js");
const pConnection = require("./mySQL/connection.js");
const express = require("express");
const isJoiErrors = require("./joiValidator.js");
const router = express.Router();
module.exports = router;
const sendEmail = require("./email/nodeMailer");

router.post("/contact", async (req, res) => {
  try {
    const isJoiErrorsResults = await isJoiErrors(req.body);
    // console.log(isJoiErrorsResults);
    if (isJoiErrorsResults === false) {
      const { email, name, message } = req.body;

      // 1. Store data in SQL database.
      // await pConnection(queries.addEmail(email));
      // let results = await pConnection(queries.getEmailId(email));
      // let email_id = results[0].id;
      // console.log(results[0]);
      // await pConnection(queries.addName(name, email_id));
      // await pConnection(queries.addMessage(message, email_id));

      // 2. Email message to me.

      sendEmail(name, email, message);

      // 3. Tell front-end it worked.
      res.send({ status: 1 });
    } else {
      // Send validation-errors to front-end.
      res.send({ status: 1, joiErrors: isJoiErrorsResults });
    }
  } catch (error) {
    res.send({ status: 0 });
  }
});

router.get("/admin_contact", async (_, res) => {
  // console.log("recieved");
  try {
    let result = await pConnection(queries.getAdminContact());
    res.send({ status: 1, result });
  } catch (error) {
    res.send({ status: 0, error });
  }
});

// req.body = {phone: "x", email: "x"}
router.post("/admin_contact", async (req, res) => {
  console.log("recieved");
  try {
    const { email, phone } = req.body;
    let results;
    if (email && phone) {
      results = await pConnection(
        queries.addAdminContact(email.toString(), phone.toString())
      );
    } else {
      let oldContact = await pConnection(queries.getAdminContact());
      let oldPhone = oldContact[0].phone;
      let oldEmail = oldContact[0].email;
      results = !phone
        ? await pConnection(queries.addAdminContact(email.toString(), oldPhone))
        : await pConnection(
            queries.addAdminContact(oldEmail, phone.toString())
          );
    }
    res.send({ status: 1 });
  } catch (error) {
    res.send({ status: 0, error });
  }
});

// const obj = {
//   email: "test@4.44444",
//   name: "t4st",
//   message: "yo, whats up 44444",
// };

// const test = async (obj) => {
//   let results = await pConnection(queries.addEmail(obj.email));
//   let email_id = results.insertId;
//   await pConnection(queries.addName(obj.name, email_id));
//   await pConnection(queries.addMessage(obj.message, email_id));
// };

// test(obj);
