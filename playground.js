const isBST = (date) => {
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
};

function isLocalTimeUKTime() {
  let date = new Date();
  let date2 = new Date();
  isBST(date2) && date2.setHours(date2.getHours() + 1);

  return (
    date.getHours() === date2.getUTCHours() &&
    date.getDay() === date2.getUTCDay() &&
    date.getDate() === date2.getUTCDate() &&
    date.getMonth() === date2.getUTCMonth() &&
    date.getFullYear() === date2.getUTCFullYear()
  );
}
let d = new Date();
console.log(d.toLocaleString());
console.log(isLocalTimeUKTime());
