const queries = {
  addAdminContact: function (email, phone) {
    return `INSERT IGNORE INTO admin_contact (id, email, phone, entry_date) 
                VALUES (NULL, "${email}", "${phone}", current_timestamp());`;
  },
  getAdminContact: function () {
    return `SELECT admin_contact.email, admin_contact.phone
                FROM admin_contact
                    ORDER BY id DESC LIMIT 1`;
  },
  addAdminPrices: function (preAssessment, assessment) {
    return `INSERT IGNORE INTO admin_prices (id, pre_assessment, assessment, entry_date) 
                VALUES (NULL, "${preAssessment}", "${assessment}", current_timestamp());`;
  },
  getAdminPrices: function () {
    return `SELECT admin_prices.pre_assessment, admin_prices.assessment
                FROM admin_prices
                    ORDER BY id DESC LIMIT 1`;
  },
};

module.exports = queries;
