const products = {
  assessment: {
    name: "Assessment",
    description: (time) => {
      let date = new Date(time);
      date = date.toLocaleString("en-GB");
      return `Booking at ${date} for full assesment. Will take 1-2 hours... etc etc. If you need to re-schedule, please contact us through the contact form on the home page.`;
    },
  },
  pre_assessment: {
    name: "Initial Consultation",
    description: (time) => {
      let date = new Date(time);
      date = date.toLocaleString("en-GB");
      return `Booking at ${date} for pre-assessment. Will take 1-2 hours... etc etc. If you need to re-schedule, please contact us through the contact form on the home page.`;
    },
  },
};

module.exports = products;
