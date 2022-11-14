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

// let exd = [1664796600000, [1666220400000, 1667084400000], 1669796600000];
// let t = new Date(1665820400000);

// console.log(t.getTime());

// console.log(isDateException(t, exd));

// let x = 1664392500000;
// console.log(typeof x === "number");

let arr = [
  { id: 1, type: 1, time: 1664796600000, date_range_end: null },
  {
    id: 2,
    type: 2,
    time: 1665220400000,
    date_range_end: 1667084400000,
  },
  { id: 4, type: 1, time: 1664392500000, date_range_end: null },
  { id: 9, type: 1, time: 1634392500000, date_range_end: null },
];
// console.log(arr);
// const splitDatesAndSlots = (SQLarr) => {
//   // seperates exception dates/date-ranges (eg. 25/12/2022) & exception fs (eg. 16:00 25/12/2022)
//   let output = { slots: [], dates: [] };
//   SQLarr.map((item) => {
//     if (item.type === 0) return output.slots.push(item);
//     return output.dates.push(item);
//   });
//   console.log(output);
//   return output;
// };
// splitDatesAndSlots(arr);
let cleaned = arr.filter((item) => {
  let now = new Date();
  now = now.getTime();
  if (item.date_range_end) {
    if (item.date_range_end < now) return true;
  } else {
    if (item.time < now) return true;
  }
});

let now = new Date();
// console.log(now);

now.setDate(now.getDate() + 80);
// console.log(now.toDateString());

function isDST(d) {
  let jan = new Date(d.getFullYear(), 0, 1).getTimezoneOffset();
  let jul = new Date(d.getFullYear(), 6, 1).getTimezoneOffset();
  return Math.max(jan, jul) !== d.getTimezoneOffset();
}

// console.log(isDST(now));

// let timeslot = new Date();
// timeslot.setUTCFullYear(2022);
// timeslot.setUTCMonth(9);
// timeslot.setUTCDate(14);
// timeslot.setUTCHours(00);
// timeslot.setUTCMinutes(00);
// timeslot.setUTCSeconds(00);
// timeslot.setUTCMilliseconds(00);

// console.log(timeslot.toUTCString());

// // let e = new Date(1667174400000);
// console.log(e.toLocaleString());

let n = "Ardalan";
let d = new Date();
d = d.getTime();

let randomCodeGen = () => {
  let s4 = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  };
  //return id of format 'aaaaaaaa'-'aaaa'-'aaaa'-'aaaa'-'aaaaaaaaaaaa'
  return (
    s4() +
    s4() +
    "-" +
    s4() +
    "-" +
    s4() +
    "-" +
    s4() +
    "-" +
    s4() +
    s4() +
    s4()
  );
};

let x = new Date(1676388600000);
// console.log(x.toString());

let m = new Date(date.UTC());
console.log(m);


// for exceptions: Get month/year/date and turn into UTC in back end.

// SEND 10/02/2023
// Create UTC time: 



// 