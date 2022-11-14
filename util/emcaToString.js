const emcaToString = (int) => {
  let date = new Date(int);
  return date.toLocaleString("en-GB");
};

module.exports = emcaToString;
