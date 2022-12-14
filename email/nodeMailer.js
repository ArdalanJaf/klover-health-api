const nodemailer = require("nodemailer");
const emailTemplates = require("./emailTemplates");
const queries = require("../mySQL/queries.js");
const pConnection = require("../mySQL/connection.js");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  // tls: { rejectUnauthorized: false }, //turns security of as cheap server
  port: 465,
  secure: true, //allow use of port 587 must be true if port 465
  auth: {
    user: process.env.EMAIL_SITE,
    pass: process.env.EMAIL_PASS,
  },
});

// contact: from site, to Risha, deets: user name/email/message
// payment made -> user: from site, to userEmail, deets: name, Risha email, price, coupon?
// payment made -> Risha: from site, to Risha, deets: name, userEmail, etc

async function sendEmail(type, emailData) {
  let mailOptions = {};

  // fetch Richa's email
  const results = await pConnection(queries.getContact());
  let richaEmail = results[0].email;

  switch (type) {
    case "contact":
      mailOptions = emailTemplates.contact(richaEmail, emailData);
      break;
    case "booking-richa":
      mailOptions = emailTemplates.bookingForRicha(richaEmail, emailData);
      break;
    case "booking-client":
      mailOptions = emailTemplates.bookingForClient(emailData.email, emailData);
      break;
    case "pay-link-confirmation":
      mailOptions = emailTemplates.payLinkConfirmation(richaEmail, emailData);
    default:
      console.log("No type match.");
  }

  transporter.sendMail(mailOptions, (error, info) => {
    console.log(error, info);
  });
}

module.exports = sendEmail;
