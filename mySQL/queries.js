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
  getTimeslots: function () {
    return `SELECT admin_timeslots.day,admin_timeslots.hour,admin_timeslots.minutes FROM admin_timeslots;`;
  },
  getDateExceptions: function () {
    return `SELECT admin_timeslots_exceptions_dates.date_range_start,admin_timeslots_exceptions_dates.date_range_end  FROM admin_timeslots_exceptions_dates`;
  },
  getTimeslotExceptions: function () {
    return `SELECT admin_timeslots_exceptions_slots.date FROM admin_timeslots_exceptions_slots;`;
  },
  getTimeslotsInfo: function () {
    return `BEGIN;
              SELECT admin_timeslots.day,admin_timeslots.hour,admin_timeslots.minutes FROM admin_timeslots;
              SELECT admin_timeslots_exceptions_dates.date FROM admin_timeslots_exceptions_dates;
            COMMIT;`;
  },
  getTimeslotExceptions: function () {
    return `SELECT admin_timeslots_exceptions.type, admin_timeslots_exceptions.time,admin_timeslots_exceptions.date_range_end  
              FROM admin_timeslots_exceptions`;
  },
};
// const makeSQLValueArr = (SQLarr) => {
//   let output = [];
//   SQLarr.map((item) => {
//     let range = [];
//     range.push(Object.values(item)[0]);
//     range.push(Object.values(item)[1]);
//     output.push(range);
//   });
//   return output;
// };
// const makeSQLValueArr = (SQLarr) => {
//   let output = [];
//   SQLarr.map((item) => {output.push(Object.values(item)[0])});
//   return output;
// };

module.exports = queries;
