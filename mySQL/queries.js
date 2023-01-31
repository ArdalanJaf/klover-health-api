const { date } = require("joi");

const queries = {
  updateContact: function (email) {
    return `UPDATE contact
              SET
              email = "${email}",
              entry_date = current_timestamp()
                  WHERE id = 1`;
  },
  getContact: function () {
    return `SELECT contact.email
                FROM contact
                    where id = 1`;
  },
  updatePrices: function (preAssessment, assessment, docs) {
    return `UPDATE prices 
                SET
                pre_assessment = ${preAssessment},
                assessment = ${assessment},
                docs = ${docs},
                entry_date = current_timestamp()
                    WHERE id = 1`;
  },
  getPrices: function () {
    return `SELECT prices.pre_assessment, prices.assessment, prices.docs
                FROM prices
                    WHERE id = 1`;
  },
  getTimeslots: function () {
    return `SELECT timeslots.id, timeslots.day,timeslots.hour,timeslots.minutes FROM timeslots;`;
  },
  delTimeslot: function (id) {
    return `DELETE FROM timeslots WHERE id = ${id};
    `;
  },
  addTimeslot: function ({ day, hour, minutes }) {
    return `INSERT INTO timeslots (id, day, hour, minutes, entry_date) 
                VALUES (NULL, ${day}, ${hour}, ${minutes}, current_timestamp());`;
  },
  getUnavailability: function () {
    return `SELECT unavailability.id, unavailability.type, unavailability.time,unavailability.date_range_end  
              FROM unavailability`;
  },
  addUnavailability: function ({ type, time, date_range_end = "NULL" }) {
    return `INSERT INTO unavailability (id, type, time, date_range_end, entry_date) 
    VALUES (NULL, ${type}, ${time}, ${date_range_end}, current_timestamp());`;
  },
  delUnavailability: function (id) {
    return `DELETE FROM unavailability WHERE id = ${id};
    `;
  },
  getTsOptions: function () {
    return `SELECT timeslot_options.fixed_max, timeslot_options.no_of_weeks, timeslot_options.max_date_year, timeslot_options.max_date_month, timeslot_options.max_date_date, timeslot_options.cushion_days
                FROM timeslot_options            
                    WHERE id = 1;`;
  },
  updateTsOptions: function (payload) {
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
  cleanUnavailability: function (payload) {
    const arraySpreader = (arr) => {
      let output = "";
      arr.map((id, i) => {
        output += `${i > 0 ? " OR" : ""} id = ${id}`;
      });
      return output;
    };
    return `DELETE FROM unavailability
                WHERE${arraySpreader(payload)};`;
  },
};

module.exports = queries;
