const dMYToUTCTime = require("./dMYToUTCTime");

const util = {
  getEarliestUTCTime: (cushionDays) => {
    if (cushionDays === 0) return 0;
    let date = new Date();
    date.setUTCHours(23);
    date.setUTCMinutes(59);
    date.setUTCSeconds(59);
    date.setUTCMilliseconds(0);
    date.setUTCDate(date.getUTCDate() + cushionDays);
    return date.getTime();
  },

  getTotalDays: (fixedMax, noOfWeeks, maxDate) => {
    let now = new Date();
    let finalDate = new Date();
    if (fixedMax) {
      finalDate.setTime(dMYToUTCTime(maxDate));
    } else {
      // finalDate = new Date()
      finalDate.setUTCDate(now.getUTCDate() + noOfWeeks * 7);
    }
    oneDay = 1000 * 60 * 60 * 24;
    return ((finalDate.getTime() - now.getTime()) / oneDay).toFixed();
  },

  matchDateToDay: (date, targetDay) => {
    if (date.getUTCDay() === targetDay) return date;
    let week = [0, 1, 2, 3, 4, 5, 6];
    let temp = week.splice(0, date.getUTCDay());
    week = week.concat(temp);
    week.splice(week.findIndex((e) => e === targetDay));
    date.setUTCDate(date.getUTCDate() + week.length);
    return date;
  },

  isDateUnavailable: (date, unavailableArr) => {
    // check if date matches with unavailable dates
    // date = date object that is being checked
    // eArray = array of dates (EMCA int) or date ranges (array of 2 EMCA ints) that are unavailable
    return unavailableArr.find((uA) => {
      if (typeof uA === "number") {
        // single date
        let uADate = new Date(uA);
        return date.toDateString() === uADate.toDateString();
      } else {
        // date range
        let startUADate = uA[0];
        let endUADate = new Date(uA[1]);
        endUADate.setUTCDate(endUADate.getUTCDate() + 1);
        return (
          date.getTime() >= startUADate && date.getTime() < endUADate.getTime()
        );
      }
    }) === undefined
      ? false
      : true;
  },

  isTimeslotUnavailable: (date, unavailableArr) => {
    return unavailableArr.includes(date.getTime());
  },

  isBST: (date) => {
    // credit to https://gist.github.com/alirussell/c52f58103db52f00fc70

    function lastSunday(month, year) {
      let d = new Date();
      let lastDayOfMonth = new Date(
        Date.UTC(year || d.getFullYear(), month + 1, 0)
      );
      let day = lastDayOfMonth.getDay();
      return new Date(
        Date.UTC(
          lastDayOfMonth.getFullYear(),
          lastDayOfMonth.getMonth(),
          lastDayOfMonth.getDate() - day
        )
      );
    }

    let d = date || new Date();
    let starts = lastSunday(2, d.getFullYear());
    starts.setHours(1);
    let ends = lastSunday(9, d.getFullYear());
    starts.setHours(1);
    return d.getTime() >= starts.getTime() && d.getTime() < ends.getTime();
  },
};

module.exports = util;
