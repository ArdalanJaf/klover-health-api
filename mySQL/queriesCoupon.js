const queriesCoupon = {
  getCoupon: function (couponCode) {
    return `SELECT coupons.code, coupons.amount, coupons.redeemed
                FROM coupons
                    WHERE coupons.code = "${couponCode}";`;
  },
  redeemCoupon: function (couponCode) {
    return `UPDATE IGNORE coupons
              SET
              redeemed = 1,
              redeemed_date = current_timestamp()
                  WHERE code = "${couponCode}";`;
  },
  addCoupon: function (couponCode, amount) {
    return `INSERT INTO coupons (id, code, amount, redeemed, entry_date, redeemed_date) 
                VALUES (NULL, "${couponCode}", ${amount}, 0, current_timestamp(), NULL);`;
  },
};

module.exports = queriesCoupon;
