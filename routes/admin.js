const queries = require("../mySQL/queries.js");
const queriesLogin = require("../mySQL/queriesLogin");
const pConnection = require("../mySQL/connection.js");
const express = require("express");
const router = express.Router();
module.exports = router;
const calcBookingTimeslots = require("../calcBookingTimeslots.js");
const sortTimeslotObjs = require("../util/sortTimeslotObjs");
const sortExceptionObjs = require("../util/sortExceptionObjs");
const flattenArrToTimes = require("../util/flattenArrToTimes.js");
const splitDatesAndSlots = require("../util/splitDatesAndSlots.js");
const dMYToUTCTime = require("../util/dMYToUTCTime");
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
        queries.addContact(email.toString(), phone.toString())
      );
    } else {
      let result = await pConnection(queries.getContact());
      let oldPhone = result[0].phone;
      let oldEmail = result[0].email;
      results = !phone
        ? await pConnection(queries.addContact(email.toString(), oldPhone))
        : await pConnection(queries.addContact(oldEmail, phone.toString()));
    }
    res.send({ status: 1 });
  } catch (error) {
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

    // let unavailability = JSON.parse(
    //   JSON.stringify(await pConnection(queries.getUnavailability()))
    // );
    // unavailability = splitDatesAndSlots(sortExceptionObjs(unavailability));
    // // why split? Do we just need dates? not slots?

    let timeslotOptions = formatTsOptions(
      await pConnection(queries.getTsOptions())
    );

    console.log(timeslotOptions);

    res.send({ status: 1, timeslotInfo: { timeslots, timeslotOptions } });
  } catch (error) {
    console.log(error);
    res.send({ status: 0, error });
  }
});

// returns unavailability
router.get("/unavailability", middleware.validateToken, async (_, res) => {
  console.log("unavailability req recieved");
  try {
    let unavailability = JSON.parse(
      JSON.stringify(await pConnection(queries.getUnavailability()))
    );
    unavailability = splitDatesAndSlots(sortExceptionObjs(unavailability));

    res.send({
      status: 1,
      timeslotInfo: { timeslots, unavailability: unavailability.dates },
    });
  } catch (error) {
    console.log(error);
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

router.post(
  "/add_unavailability",
  middleware.validateToken,
  async (req, res) => {
    console.log("req recieved", req.body);
    try {
      // if (!req.body.date_range_end) req.body.date_range_end = null;
      // console.log(req.body);
      const { startDate, endDate } = req.body;
      // if (startDate === endDate) endDate = null;
      // console.log("TEST", startDate, endDate);

      // let sDate = dMYToUTCTime(startDate)
      // let eDate = dMYToUTCTime(endDate)
      // if (sDate === eDate) eDate = null;
      // console.log(dMYToUTCTime(endDate));

      // function dMYToUTCTime(dmy, returnDate = false) {
      //   let date = new Date();
      //   date.setUTCFullYear(dmy.year);
      //   date.setUTCMonth(dmy.month);
      //   date.setUTCDate(dmy.date);
      //   date.setUTCHours(0);
      //   date.setUTCMinutes(0);
      //   date.setUTCSeconds(0);
      //   date.setUTCMilliseconds(0);
      //   if (returnDate) return date;
      //   return date.getTime();
      // }

      await pConnection(
        queries.addException({
          type: endDate ? 2 : 1,
          time: dMYToUTCTime(startDate),
          date_range_end: dMYToUTCTime(endDate),
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
      await pConnection(queries.delException(Number(req.body.id)));
      res.send({ status: 1 });
    } catch (error) {
      res.send({ status: 0, error });
    }
  }
);

router.post("/clean_exceptions", middleware.validateToken, async (_, res) => {
  try {
    let unavailability = JSON.parse(
      JSON.stringify(await pConnection(queries.getUnavailability()))
    );
    let outOfDate = unavailability.filter((item) => {
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
  // add delete all previous tokens?
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
      res.send({ status: 0, error: "Invalid username / password" });
    }
  } catch (error) {
    res.send({ status: 0, error });
  }
});

router.post(
  "/change_ts_options",
  middleware.validateToken,
  async (req, res) => {
    console.log("change ts options attempted");
    console.log(req.body);
    try {
      // check username + password are correct
      await pConnection(queries.changeTsOptions(req.body));
      res.send({ status: 1 });
    } catch (error) {
      console.log(error);
      res.send({ status: 0, error });
    }
  }
);

function formatTsOptions(SQLObj) {
  let {
    fixed_max,
    no_of_weeks,
    max_date_year,
    max_date_month,
    max_date_date,
    cushion_days,
  } = SQLObj[0];
  return {
    fixedMax: fixed_max > 0 ? true : false,
    noOfWeeks: no_of_weeks,
    maxDate: {
      year: max_date_year,
      month: max_date_month,
      date: max_date_date,
    },
    cushionDays: cushion_days,
  };
}
