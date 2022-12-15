const {
  getEarliestUTCTime,
  getTotalDays,
  matchDateToDay,
  isDateUnavailable,
  isTimeslotUnavailable,
  isBST,
} = require("./util/calcBookingTimeslotsUtil");

const calcBookingTimeslots = (
  available = [],
  unavailableSlots = [],
  unavailableDates = [],
  timeslotOptions
) => {
  //   const { available, exceptions } = timeslots;
  try {
    const output = [];
    const { fixedMax, noOfWeeks, maxDate, cushionDays } = timeslotOptions;

    // total number of days that timeslots should be generated for.
    let totalDays = getTotalDays(fixedMax, noOfWeeks, maxDate);

    // earliestDate is the earliest that an appointment can be made (eg. 3 = 3 days from today)
    let earliestTime = getEarliestUTCTime(cushionDays);

    // for each weekly timeslot...
    available.forEach((item) => {
      let date = new Date();
      let now = date.getTime();

      // bring date to same week day as available slot (eg. today: Mon 23/04, available slot: Tues => Tues 24/04)
      date = matchDateToDay(date, item.day);

      // create timeslot (date obj) for each week upto finalDate. CushionDays determines earliest day appointment is made.
      for (let i = 0; i < totalDays; i += 7) {
        let timeslot = new Date(date.getTime());
        timeslot.setUTCDate(date.getUTCDate() + i);

        // check if date of timeslot is in unavailableDates list && if date is after cushion days
        if (
          !isDateUnavailable(timeslot, unavailableDates) &&
          timeslot.getTime() > earliestTime
        ) {
          timeslot.setUTCHours(item.hour + (isBST(timeslot) ? 1 : 0));
          timeslot.setUTCMinutes(item.minutes);
          timeslot.setUTCSeconds(00);
          timeslot.setUTCMilliseconds(00);

          // check if time of timeslot is in unavailableSlots list && if time is not in past
          if (
            !isTimeslotUnavailable(timeslot, unavailableSlots) &&
            timeslot.getTime() > now
          ) {
            output.push(timeslot.getTime());
          }
        }
      }
    });
    return output.sort();
  } catch (error) {
    console.log(error);
  }
};
module.exports = calcBookingTimeslots;
