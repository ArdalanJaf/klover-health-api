function dMYToUTCTime(dmy, returnDate = false) {
  let date = new Date();
  date.setUTCFullYear(dmy.year);
  date.setUTCMonth(dmy.month);
  date.setUTCDate(dmy.date);
  date.setUTCHours(0);
  date.setUTCMinutes(0);
  date.setUTCSeconds(0);
  date.setUTCMilliseconds(0);
  if (returnDate) return date;
  return date.getTime();
}

module.exports = dMYToUTCTime;
