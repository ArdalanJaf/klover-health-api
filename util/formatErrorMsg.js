function formatErrorMsg(str) {
  let msg = str.split(" ");
  let label = msg[0].split("");
  msg.shift();

  let indexOfCap = label.findIndex((letter) => letter.match(/[A-Z]/g));
  label.splice(indexOfCap, 0, " ");
  label[1] = label[1].toUpperCase();

  return label.join("") + " " + msg.join(" ");
}

module.exports = formatErrorMsg;
