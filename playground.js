let date = 15;
let day = 5;
let mDay = 2;

// 0 , 1, 2, 3, 4, 5, 6

// 5 => 6, 0, 1, 2 (4)

function matchDateToDay(date, targetDay) {
  if (date.getDay() === targetDay) return date;
  let week = [0, 1, 2, 3, 4, 5, 6];
  let temp = week.splice(0, day);
  week = week.concat(temp);
  //   console.log(week);
  week.splice(week.findIndex((e) => e === targetDay));
  date.setDate(date.getDate() + week.length);
  return date;
}

// console.log(matchDatetoDay());
// console.log(3 % 5);

// let t = new Date("October 30, 2022 23:59:59:999");
// console.log(t);
// let bt = matchDateToDay(t);
// console.log(bt);
// bt.setMilliseconds(bt.getMilliseconds() + 1);
// console.log(bt);
// 1666220400000
// 1667084400000

let et = [
  12431241251,
  [123123123132, 123123123123],
  123123123133,
  [1231231233, 12312313],
];

function isDateException(date, excArray) {
  // check if date matches with exception dates
  // date = date object that is being checked
  // eArray = array of dates (EMCA int) or date ranges (array of 2 EMCA ints) that are exceptions
  return excArray.find((exc) => {
    if (typeof exc === "number") {
      console.log("int:", exc);
      // single date
      let excDate = new Date(exc);
      return date.toDateString() === excDate.toDateString();
    } else {
      // date range
      console.log("arr: ", exc);
      let startExcDate = exc[0];
      let endExcDate = new Date(exc[1]);
      endExcDate.setDate(endExcDate.getDate() + 1);
      return (
        date.getTime() >= startExcDate && date.getTime() < endExcDate.getTime()
      );
    }
  }) === undefined
    ? false
    : true;
}

let exd = [1664796600000, [1666220400000, 1667084400000], 1669796600000];
let t = new Date(1665820400000);

console.log(t.getTime());

console.log(isDateException(t, exd));

// let x = 1664392500000;
// console.log(typeof x === "number");
