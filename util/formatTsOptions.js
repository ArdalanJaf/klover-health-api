function formatTsOptions(SQLObj) {
  let {
    fixed_max,
    no_of_weeks,
    max_date_year,
    max_date_month,
    max_date_date,
    cushion_days,
  } = SQLObj[0];
  return {
    fixedMax: fixed_max > 0 ? true : false,
    noOfWeeks: no_of_weeks,
    maxDate: {
      year: max_date_year,
      month: max_date_month,
      date: max_date_date,
    },
    cushionDays: cushion_days,
  };
}

module.exports = formatTsOptions;
