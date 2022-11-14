const sortTimeslotObjs = (arr) => {
  // sorts timeslots into chronological order
  return arr.sort((a, b) => {
    if (a.day < b.day) {
      return -1;
    } else if (a.day > b.day) {
      return 1;
    } else if (a.hour < b.hour) {
      return -1;
    } else if (a.hour > b.hour) {
      return 1;
    } else if (a.minutes < b.minutes) {
      return -1;
    } else {
      return 1;
    }
  });
};

module.exports = sortTimeslotObjs;
