const sortExceptionObjs = (arr) => {
  return arr.sort((a, b) => {
    if (a.time < b.time) return -1;
    return 1;
  });
};

module.exports = sortExceptionObjs;
