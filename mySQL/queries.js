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
    return `SELECT admin_timeslots.id, admin_timeslots.day,admin_timeslots.hour,admin_timeslots.minutes FROM admin_timeslots;`;
  },
  getTimeslotExceptions: function () {
    return `SELECT admin_timeslots_exceptions.id, admin_timeslots_exceptions.type, admin_timeslots_exceptions.time,admin_timeslots_exceptions.date_range_end  
              FROM admin_timeslots_exceptions`;
  },
  delTimeslot: function (id) {
    return `DELETE FROM admin_timeslots WHERE id = ${id};
    `;
  },
  addTimeslot: function ({ day, hour, minutes }) {
    return `INSERT INTO admin_timeslots (id, day, hour, minutes, entry_date) 
                VALUES (NULL, ${day}, ${hour}, ${minutes}, current_timestamp());`;
  },
  addException: function ({ type, time, date_range_end }) {
    console.log(type, time, date_range_end);
    return `INSERT INTO admin_timeslots_exceptions (id, type, time, date_range_end, entry_date) 
    VALUES (NULL, ${type}, ${time}, ${date_range_end}, current_timestamp());`;
  },
  delException: function (id) {
    return `DELETE FROM admin_timeslots_exceptions WHERE id = ${id};
    `;
  },
  cleanTimeslotExceptions: function (arr) {
    rreturn`DELETE FROM admin_timeslots_exceptions 
    WHERE id IN (${arr.map((item) => {
      return item.id;
    })});`;
  },
};

module.exports = queries;
