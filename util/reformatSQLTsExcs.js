const reformatSQLTsExcs = (SQLarr) => {
  // seperates dates + timeslots, and pulls out only times into array.
  let output = { slots: [], dates: [] };
  SQLarr.map((item) => {
    switch (item.type) {
      case 0:
        output.slots.push(item.time);
        break;
      case 1:
        output.dates.push(item.time);
        break;
      default:
        output.dates.push([item.time, item.date_range_end]);
    }
  });
  return output;
};

module.exports = reformatSQLTsExcs;
