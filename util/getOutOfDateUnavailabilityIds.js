function getOutOfDateUnavailabilityIds(array) {
  let output = [];
  let today = new Date();
  today.setUTCHours(0);
  today.setUTCMinutes(0);
  today.setUTCSeconds(0);
  today.setUTCMilliseconds(0);
  today = today.getTime();
  array.map((entry) => {
    if (entry.type === 2) {
      entry.date_range_end < today && output.push(entry.id);
    } else {
      entry.time < today && output.push(entry.id);
    }
  });
  return output;
}

module.exports = getOutOfDateUnavailabilityIds;
