const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAILHOST,
  // tls: { rejectUnauthorized: false }, //turns security of as cheap server
  port: 465,
  secure: true, //allow use of port 587 must be true if port 465
  auth: {
    user: process.env.EMAILUSER,
    pass: process.env.EMAILPASS,
  },
});

function sendEmail(name, email, message) {
  const timeStamp = () => {
    let now = Date.now();
    return new Date(now).toString();
  };

  const mailOptions = {
    from: process.env.EMAILUSER,
    to: process.env.EMAILUSER,
    subject: `Site-Message recieved from ${name}`,
    text: `
    Name: ${name}
    Email: ${email}
    Date-recieved: ${timeStamp()}
    Message:
    ${message}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    console.log(error, info);
  });
}

module.exports = sendEmail;
