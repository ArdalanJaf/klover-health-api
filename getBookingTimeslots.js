// const timeslots = {
//   available: [
//     { day: 1, hours: 12, minutes: 30 },
//     { day: 1, hours: 16, minutes: 00 },
//     // { day: 5, hours: 14, minutes: 15 },
//   ],
//   exceptions: {
//     dates: [1664796600000], //1664796600000
//     slots: [1666611000000], //1666611000000
//   },
// };

const getBookingTimeslots = (
  available = [],
  excSlots = [],
  excDates = [],
  noOfMonths = 3
) => {
  //   const { available, exceptions } = timeslots;
  try {
    const output = [];
    let now = new Date();

    // how many months of timeslots should be generated
    let finalDate = new Date();
    const MAX_MONTHS_TO_GEN_DATES = noOfMonths;
    finalDate.setMonth(now.getUTCMonth() + MAX_MONTHS_TO_GEN_DATES); //mutable
    oneDay = 1000 * 60 * 60 * 24;
    totalDays = ((finalDate.getTime() - now.getTime()) / oneDay).toFixed();

    available.forEach((item) => {
      let date = new Date();

      // bring date to same week day as available slot (eg. today: Mon 23/04, available slot: Tues => Tues 24/04)
      date = matchDateToDay(date, item.day);

      // create timeslot (date obj) for each week upto finalDate
      for (let i = 0; i < totalDays; i += 7) {
        let timeslot = new Date(date.getTime());
        timeslot.setDate(date.getUTCDate() + i);

        // check if date of timeslot is in exception list
        if (!isDateException(timeslot, excDates)) {
          timeslot.setHours(item.hour);
          timeslot.setMinutes(item.minutes);
          timeslot.setSeconds(00);
          timeslot.setMilliseconds(00);

          // check if time of timeslot is in exception list
          if (!isTimeslotException(timeslot, excSlots))
            // push timeslot into output array as EMCA int.
            output.push(timeslot.getTime());
        }
      }
    });
    return output.sort();
  } catch (error) {
    console.log(error);
  }

  function matchDateToDay(date, targetDay) {
    if (date.getUTCDay() === targetDay) return date;
    let week = [0, 1, 2, 3, 4, 5, 6];
    let temp = week.splice(0, date.getUTCDay());
    week = week.concat(temp);
    week.splice(week.findIndex((e) => e === targetDay));
    date.setDate(date.getUTCDate() + week.length);
    return date;
  }

  function isDateException(date, excArray) {
    // check if date matches with exception dates
    // date = date object that is being checked
    // eArray = array of dates (EMCA int) or date ranges (array of 2 EMCA ints) that are exceptions
    return excArray.find((exc) => {
      if (typeof exc === "number") {
        // single date
        let excDate = new Date(exc);
        return date.toDateString() === excDate.toDateString();
      } else {
        // date range
        let startExcDate = exc[0];
        let endExcDate = new Date(exc[1]);
        endExcDate.setDate(endExcDate.getUTCDate() + 1);
        return (
          date.getTime() >= startExcDate &&
          date.getTime() < endExcDate.getTime()
        );
      }
    }) === undefined
      ? false
      : true;
  }

  function isTimeslotException(date, excArray) {
    return excArray.includes(date.getTime());
  }

  function isDST(d) {
    let jan = new Date(d.getFullYear(), 0, 1).getTimezoneOffset();
    let jul = new Date(d.getFullYear(), 6, 1).getTimezoneOffset();
    return Math.max(jan, jul) !== d.getTimezoneOffset();
  }
};
module.exports = getBookingTimeslots;
