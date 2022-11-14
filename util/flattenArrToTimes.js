const flattenArrToTimes = (arr) => {
  // turns array of objects into array of object.time
  let output = [];
  arr.map((item) => {
    if (item.type === 2) return output.push([item.time, item.date_range_end]);
    return output.push(item.time);
  });
  return output;
};

module.exports = flattenArrToTimes;
