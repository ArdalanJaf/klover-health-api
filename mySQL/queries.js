const queries = {
  addContact: function (email, phone) {
    return `INSERT IGNORE INTO contact (id, email, phone, entry_date) 
                VALUES (NULL, "${email}", "${phone}", current_timestamp());`;
  },
  getContact: function () {
    return `SELECT contact.email, contact.phone
                FROM contact
                    ORDER BY id DESC LIMIT 1`;
  },
  addPrices: function (preAssessment, assessment) {
    return `INSERT IGNORE INTO prices (id, pre_assessment, assessment, entry_date) 
                VALUES (NULL, ${preAssessment}, ${assessment}, current_timestamp());`;
  },
  getPrices: function () {
    return `SELECT prices.pre_assessment, prices.assessment
                FROM prices
                    ORDER BY id DESC LIMIT 1`;
  },
  getTimeslots: function () {
    return `SELECT timeslots.id, timeslots.day,timeslots.hour,timeslots.minutes FROM timeslots;`;
  },
  getUnavailability: function () {
    return `SELECT unavailability.id, unavailability.type, unavailability.time,unavailability.date_range_end  
              FROM unavailability`;
  },
  delTimeslot: function (id) {
    return `DELETE FROM timeslots WHERE id = ${id};
    `;
  },
  addTimeslot: function ({ day, hour, minutes }) {
    return `INSERT INTO timeslots (id, day, hour, minutes, entry_date) 
                VALUES (NULL, ${day}, ${hour}, ${minutes}, current_timestamp());`;
  },
  addException: function ({ type, time, date_range_end }) {
    console.log(type, time, date_range_end);
    return `INSERT INTO unavailability (id, type, time, date_range_end, entry_date) 
    VALUES (NULL, ${type}, ${time}, ${date_range_end}, current_timestamp());`;
  },
  delException: function (id) {
    return `DELETE FROM unavailability WHERE id = ${id};
    `;
  },
  cleanTimeslotExceptions: function (arr) {
    return `DELETE FROM unavailability 
    WHERE id IN (${arr.map((item) => {
      return item.id;
    })});`;
  },
  getTsOptions: function () {
    return `SELECT timeslot_options.fixed_max, timeslot_options.no_of_weeks, timeslot_options.max_date_year, timeslot_options.max_date_month, timeslot_options.max_date_date, timeslot_options.cushion_days
                FROM timeslot_options            
                    WHERE id = 1;`;
  },
  changeTsOptions: function (payload) {
    return `UPDATE timeslot_options
              SET 
              fixed_max = ${payload.fixedMax ? 1 : 0},
              no_of_weeks = ${payload.noOfWeeks},
              max_date_year = ${payload.maxDate.year},
              max_date_month = ${payload.maxDate.month},
              max_date_date = ${payload.maxDate.date},
              cushion_days = ${payload.cushionDays}
                       WHERE id = 1;`;
  },
};

// const ting = ` timeslot_options.no_of_weeks = ${payload.noOfWeeks},
// timeslot_options.max_date_year = ${payload.maxDate.year},
// timeslot_options.max_date_month = ${payload.maxDate.month},
// timeslot_options.max_date_date = ${payload.maxDate.date},
// timeslot_options.cushion_days = ${payload.maxDate.cushionDays}
// `;

module.exports = queries;
