const queries = require("../mySQL/queries.js");
const pConnection = require("../mySQL/connection.js");
const express = require("express");
const router = express.Router();
module.exports = router;
const getBookingTimeslots = require("../getBookingTimeslots.js");

router.get("/contact", async (_, res) => {
  // console.log("recieved");
  try {
    let result = await pConnection(queries.getAdminContact());
    res.send({ status: 1, result });
  } catch (error) {
    res.send({ status: 0, error });
  }
});

// req.body = {phone: "x", email: "x"}
router.post("/contact", async (req, res) => {
  console.log("recieved");
  try {
    const { email, phone } = req.body;
    let results;
    if (email && phone) {
      results = await pConnection(
        queries.addAdminContact(email.toString(), phone.toString())
      );
    } else {
      let result = await pConnection(queries.getAdminContact());
      let oldPhone = result[0].phone;
      let oldEmail = result[0].email;
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

router.get("/timeslots", async (_, res) => {
  console.log("recieved");
  try {
    let availableTs = JSON.parse(
      JSON.stringify(await pConnection(queries.getTimeslots()))
    );
    // console.log(availableTs);

    let exceptionTs = JSON.parse(
      JSON.stringify(await pConnection(queries.getTimeslotExceptions()))
    );

    // console.log(exceptionTs);
    exceptionTs = reformatSQLTsExcs(exceptionTs);

    let timeslots = await getBookingTimeslots(
      availableTs,
      exceptionTs.slots,
      exceptionTs.dates
    );
    console.log(timeslots, timeslots.length);

    res.send({ status: 1, timeslots });
  } catch (error) {
    res.send({ status: 0, error });
  }
});

const reformatSQLTsExcs = (SQLarr) => {
  let output = { slots: [], dates: [] };
  SQLarr.map((item) => {
    switch (item.type) {
      case 0:
        output.slots.push(item.date);
        break;
      case 1:
        output.dates.push(item.time);
        break;
      default:
        output.dates.push([item.time, item.date_range_end]);
    }
  });
  return output;
};
