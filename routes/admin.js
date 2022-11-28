const express = require("express");
const router = express.Router();
module.exports = router;
const queries = require("../mySQL/queries.js");
const queriesLogin = require("../mySQL/queriesLogin");
const pConnection = require("../mySQL/connection.js");
const calcBookingTimeslots = require("../calcBookingTimeslots.js");
const sortTimeslotObjs = require("../util/sortTimeslotObjs");
const sortExceptionObjs = require("../util/sortExceptionObjs");
const flattenArrToTimes = require("../util/flattenArrToTimes.js");
const splitDatesAndSlots = require("../util/splitDatesAndSlots.js");
const dMYToUTCTime = require("../util/dMYToUTCTime");
const getUniqueId = require("../util/getUniqueId");
const formatTsOptions = require("../util/formatTsOptions");
const middleware = require("../middleware");

router.get("/contact", middleware.validateToken, async (_, res) => {
  console.log("contact req recieved");
  try {
    let result = await pConnection(queries.getContact());

    res.send({ status: 1, email: result[0].email });
  } catch (error) {
    console.log(error);
    res.send({ status: 0, error });
  }
});

router.post("/update_contact", middleware.validateToken, async (req, res) => {
  console.log("update_contact req recieved", req.body);
  try {
    await pConnection(queries.updateContact(req.body.email.toString()));
    res.send({ status: 1 });
  } catch (error) {
    console.log(error);
    res.send({ status: 0, error });
  }
});

router.get("/prices", async (_, res) => {
  try {
    let result = await pConnection(queries.getPrices());
    let prices = {
      preAssessment: result[0].pre_assessment,
      assessment: result[0].assessment,
    };
    res.send({ status: 1, prices });
  } catch (error) {
    res.send({ status: 0, error });
  }
});

router.post("/update_prices", middleware.validateToken, async (req, res) => {
  try {
    await pConnection(
      queries.updatePrices(req.body.preAssessment, req.body.assessment)
    );
    res.send({ status: 1 });
  } catch (error) {
    res.send({ status: 0, error });
  }
});

// calculates and returns available timeslots
router.get("/timeslots", async (_, res) => {
  console.log("timeslots req recieved");
  try {
    let timeslots = JSON.parse(
      JSON.stringify(await pConnection(queries.getTimeslots()))
    );

    let unavailability = JSON.parse(
      JSON.stringify(await pConnection(queries.getUnavailability()))
    );
    unavailability = splitDatesAndSlots(unavailability);

    let timeslotOptions = formatTsOptions(
      await pConnection(queries.getTsOptions())
    );

    // create array of available times/dates from timeslots
    let availableTs = await calcBookingTimeslots(
      timeslots,
      flattenArrToTimes(unavailability.slots),
      flattenArrToTimes(unavailability.dates),
      timeslotOptions
    );
    res.send({ status: 1, availableTs });
  } catch (error) {
    res.send({ status: 0, error });
  }
});

// returns timeslot info (timeslots and timeslot_options)
router.get("/timeslots_info", middleware.validateToken, async (_, res) => {
  console.log("timeslot info req recieved");
  try {
    let timeslots = JSON.parse(
      JSON.stringify(await pConnection(queries.getTimeslots()))
    );
    timeslots = sortTimeslotObjs(timeslots);

    let timeslotOptions = formatTsOptions(
      await pConnection(queries.getTsOptions())
    );

    res.send({ status: 1, timeslotInfo: { timeslots, timeslotOptions } });
  } catch (error) {
    console.log(error);
    res.send({ status: 0, error });
  }
});

router.post(
  "/update_ts_options",
  middleware.validateToken,
  async (req, res) => {
    console.log("change ts options request");
    try {
      // check username + password are correct
      await pConnection(queries.updateTsOptions(req.body));
      res.send({ status: 1 });
    } catch (error) {
      console.log(error);
      res.send({ status: 0, error });
    }
  }
);

router.post("/del_timeslot", middleware.validateToken, async (req, res) => {
  try {
    await pConnection(queries.delTimeslot(Number(req.body.id)));
    res.send({ status: 1 });
  } catch (error) {
    res.send({ status: 0, error });
  }
});

router.post("/add_timeslot", middleware.validateToken, async (req, res) => {
  try {
    await pConnection(queries.addTimeslot(req.body.timeslot));
    res.send({ status: 1 });
  } catch (error) {
    res.send({ status: 0, error });
  }
});

router.get("/unavailability", middleware.validateToken, async (_, res) => {
  console.log("unavailability req recieved");
  try {
    let unavailability = JSON.parse(
      JSON.stringify(await pConnection(queries.getUnavailability()))
    );
    unavailability = splitDatesAndSlots(sortExceptionObjs(unavailability));
    res.send({
      status: 1,
      unavailability: unavailability.dates,
    });
  } catch (error) {
    console.log(error);
    res.send({ status: 0, error });
  }
});

router.post(
  "/add_unavailability",
  middleware.validateToken,
  async (req, res) => {
    console.log("req recieved", req.body);
    try {
      const { startDate, endDate } = req.body;
      await pConnection(
        queries.addUnavailability({
          type: endDate ? 2 : 1,
          time: dMYToUTCTime(startDate),
          date_range_end: !endDate ? "NULL" : dMYToUTCTime(endDate),
        })
      );

      res.send({ status: 1 });
    } catch (error) {
      console.log(error);
      res.send({ status: 0, error });
    }
  }
);

router.post(
  "/del_unavailability",
  middleware.validateToken,
  async (req, res) => {
    console.log("del_exception", req.body);
    try {
      await pConnection(queries.delUnavailability(Number(req.body.id)));
      res.send({ status: 1 });
    } catch (error) {
      res.send({ status: 0, error });
    }
  }
);

router.post("/login", async (req, res) => {
  console.log("login detected");
  // add delete all previous tokens?
  try {
    await pConnection(queriesLogin.deleteAllTokens());

    // check username + password are correct
    let result = await pConnection(
      queriesLogin.checkUserAndPassword(req.body.username, req.body.password)
    );
    // if username/password valid create + set token, send token to front
    if (result[0].count > 0) {
      const token = getUniqueId(128);
      await pConnection(queriesLogin.setToken(result[0].userId, token));

      res.send({ status: 1, userId: result[0].userId, token: token });
    } else {
      res.send({ status: 0, error: "Invalid username / password" });
    }
  } catch (error) {
    res.send({ status: 0, error });
  }
});
