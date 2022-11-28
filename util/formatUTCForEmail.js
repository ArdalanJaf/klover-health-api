const util = require("./calcBookingTimeslotsUtil");

function formatUTCForEmail(utcTime) {
  function makeDoubleDigitStr(int) {
    return int < 10 ? "0" + int : int;
  }

  function make12HourTime(int) {
    if (int >= 12) return int - 12;
    return int;
  }

  let date = new Date(utcTime);
  if (util.isBST(date)) date.setHours(date.getHours() + 1);

  let timeStr = `${make12HourTime(date.getUTCHours())}:${makeDoubleDigitStr(
    date.getUTCMinutes()
  )}${date.getUTCHours() > 12 ? "pm" : "am"}`;

  const months = [
    "January",
    "Febuary",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wedneday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let dateStr = `${days[date.getUTCDay()]}, ${date.getUTCDate()} ${
    months[date.getUTCMonth()]
  } ${date.getUTCFullYear()} ${util.isBST(date) ? "(BST)" : "(GMT)"}`;

  return timeStr + " " + dateStr;
}

module.exports = formatUTCForEmail;
