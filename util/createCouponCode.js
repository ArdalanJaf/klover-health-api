function createCouponCode(lastName, length) {
  let code = lastName.substring(0, 3).toUpperCase();
  const nums = "123456789012345678901234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numsLength = nums.length;
  for (let index = 0; index < length - 3; index++) {
    code += nums.charAt(Math.floor(Math.random() * numsLength));
  }
  return code;
}

module.exports = createCouponCode;
