const queries = require("../mySQL/queries.js");
const queriesLogin = require("../mySQL/queriesLogin");
const pConnection = require("../mySQL/connection.js");
const express = require("express");
const router = express.Router();
module.exports = router;
const getBookingTimeslots = require("../getBookingTimeslots.js");
const reformatSQLTsExcs = require("../util/reformatSQLTsExcs.js");
const sortTimeslotObjs = require("../util/sortTimeslotObjs");
const sortExceptionObjs = require("../util/sortExceptionObjs");
const flattenArrToTimes = require("../util/flattenArrToTimes.js");
const splitDatesAndSlots = require("../util/splitDatesAndSlots.js");
const getUniqueId = require("../util/getUniqueId");
const middleware = require("../middleware");

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
router.post("/contact", middleware.validateToken, async (req, res) => {
  console.log("contact recieved");
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

router.get("/prices", async (_, res) => {
  try {
    let result = await pConnection(queries.getAdminPrices());
    let prices = {
      preAssessment: result[0].pre_assessment,
      assessment: result[0].assessment,
    };
    res.send({ status: 1, prices });
  } catch (error) {
    res.send({ status: 0, error });
  }
});

// calculates and returns available timeslots
router.get("/timeslots", async (_, res) => {
  console.log("timeslots recieved");
  try {
    let timeslots = JSON.parse(
      JSON.stringify(await pConnection(queries.getTimeslots()))
    );

    let exceptionTs = JSON.parse(
      JSON.stringify(await pConnection(queries.getTimeslotExceptions()))
    );

    exceptionTs = splitDatesAndSlots(exceptionTs);

    //create array of available timeslots
    let availableTs = await getBookingTimeslots(
      timeslots,
      flattenArrToTimes(exceptionTs.slots),
      flattenArrToTimes(exceptionTs.dates)
    );
    res.send({ status: 1, availableTs });
  } catch (error) {
    res.send({ status: 0, error });
  }
});

// returns timeslot info (weekly slots and exceptions)
router.get("/timeslots_info", middleware.validateToken, async (_, res) => {
  console.log("timeslot info recieved");
  try {
    let timeslots = JSON.parse(
      JSON.stringify(await pConnection(queries.getTimeslots()))
    );
    timeslots = sortTimeslotObjs(timeslots);

    let exceptionTs = JSON.parse(
      JSON.stringify(await pConnection(queries.getTimeslotExceptions()))
    );
    exceptionTs = splitDatesAndSlots(sortExceptionObjs(exceptionTs));

    res.send({ status: 1, timeslotInfo: { timeslots, exceptionTs } });
  } catch (error) {
    res.send({ status: 0, error });
  }
});

router.post("/del_timeslot", middleware.validateToken, async (req, res) => {
  try {
    console.log(req.body);
    await pConnection(queries.delTimeslot(Number(req.body.id)));

    res.send({ status: 1 });
  } catch (error) {
    res.send({ status: 0, error });
  }
});

router.post("/add_timeslot", middleware.validateToken, async (req, res) => {
  try {
    console.log(req.body);
    await pConnection(queries.addTimeslot(req.body.timeslot));
    // need worked confirmation
    res.send({ status: 1 });
  } catch (error) {
    res.send({ status: 0, error });
  }
});

router.post("/add_exception", middleware.validateToken, async (req, res) => {
  try {
    // if (!req.body.date_range_end) req.body.date_range_end = null;
    console.log(req.body);
    const { startDate, endDate } = req.body;

    function dMYToUTCTime(dateValues) {
      if (dateValues === null) return null;
      let { date, month, year } = dateValues;
      let nDate = new Date();
      nDate.setUTCFullYear(year);
      nDate.setUTCMonth(month);
      nDate.setUTCDate(date);
      nDate.setUTCHours(00);
      nDate.setUTCMinutes(00);
      nDate.setUTCSeconds(00);
      nDate.setUTCMilliseconds(00);
      return nDate.getTime();
    }

    console.log(dMYToUTCTime(endDate));

    await pConnection(
      queries.addException({
        type: endDate ? 2 : 1,
        time: dMYToUTCTime(startDate),
        date_range_end: dMYToUTCTime(endDate),
      })
    );

    res.send({ status: 1 });
  } catch (error) {
    res.send({ status: 0, error });
  }
});

router.post("/del_exception", middleware.validateToken, async (req, res) => {
  console.log("del_exception", req.body);
  try {
    await pConnection(queries.delException(Number(req.body.id)));
    res.send({ status: 1 });
  } catch (error) {
    res.send({ status: 0, error });
  }
});

router.post("/clean_exceptions", middleware.validateToken, async (_, res) => {
  try {
    let exceptionTs = JSON.parse(
      JSON.stringify(await pConnection(queries.getTimeslotExceptions()))
    );
    let outOfDate = exceptionTs.filter((item) => {
      let now = new Date();
      now = now.getTime();
      if (item.date_range_end) {
        if (item.date_range_end < now) return true;
      } else {
        if (item.time < now) return true;
      }
    });
    if (outOfDate.length > 0)
      await pConnection(queries.cleanTimeslotExceptions(outOfDate));

    res.send({ status: 1 });
  } catch (error) {
    res.send({ status: 0, error });
  }
});

router.post("/login", async (req, res) => {
  console.log("login detected");
  try {
    // check username + password are correct
    let result = await pConnection(
      queriesLogin.checkUserAndPassword(req.body.username, req.body.password)
    );
    console.log(result[0].count);
    // if username/password valid create + set token, send token to front
    if (result[0].count > 0) {
      const token = getUniqueId(128);
      await pConnection(queriesLogin.setToken(result[0].userId, token));

      res.send({ status: 1, userId: result[0].userId, token: token });
    } else {
      res.send({ status: 2, error: "Invalid username / password" });
    }
  } catch (error) {
    res.send({ status: 0, error });
  }
});
