const getUniqueId = (length) => {
  // used to generate token
  const now = Date.now().toString();
  let uniqueId = "";
  const chars =
    "ABCDEFGHIJUKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz";
  const charsLength = chars.length;

  for (let index = 0; index < length - now.length; index++) {
    uniqueId += chars.charAt(Math.floor(Math.random() * charsLength));
  }
  return uniqueId + Date.now();
};

module.exports = getUniqueId;
