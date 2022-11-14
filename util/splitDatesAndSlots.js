const splitDatesAndSlots = (SQLarr) => {
  // seperates exception dates/date-ranges (eg. 25/12/2022) & exception timeslots (eg. 16:00 25/12/2022)
  let output = { slots: [], dates: [] };
  SQLarr.map((item) => {
    // console.log(item);
    if (item.type === 0) return output.slots.push(item);
    return output.dates.push(item);
  });
  // console.log(output);
  return output;
};

module.exports = splitDatesAndSlots;
