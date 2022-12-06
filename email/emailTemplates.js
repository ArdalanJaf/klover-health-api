const formatUTCForEmail = require("../util/formatUTCForEmail");
const numToPrice = require("../util/numToPrice");

const emailTemplates = {
  contact: (richaEmail, { name, email, message }) => {
    return {
      from: process.env.EMAIL_SITE,
      to: richaEmail,
      subject: `Klover: Message from ${name}`,
      html: `<HTML>
            <body>
                <h3>You have been contacted on Klover Healthcare!</h3>
                Name: <b>${name} </b><br/>
                Email:<b>${email} </b> <br/>
                <br/>
                Message: <br/>
                ${message}

                <br/>
                <br/>
                <u>Remember: email them back directly at ${email}</u>
            </body>
        </HTML>`,
    };
  },
  bookingForRicha: (
    richaEmail,
    {
      productId,
      timeslot,
      firstName,
      lastName,
      email,
      phone,
      couponCode,
      amount,
    }
  ) => {
    product = productId === 1 ? "Full Assessment" : "Pre-Assessment";
    return {
      from: process.env.EMAIL_SITE,
      to: richaEmail,
      subject: `Klover: ${product} booked!`,
      html: `<HTML>
            <body>
                <h2>Booking Confirmation</h2>
                <p>What: <b>${product.toUpperCase()}</b><br/>
               When: <b>${formatUTCForEmail(timeslot)}<br/></b>
            Paid: <b>£${numToPrice(amount)}</p></b>
                
                <h3>Customer Details</h3>  
              <p> Name: <b>${firstName} ${lastName}</b><br/>
               Email: ${email}</b><br/>
               Phone: <b>${phone}</b>
                ${
                  productId === 2
                    ? `<br/>Full-assessment discount code: <b>${couponCode}</b>`
                    : ""
                }</p>

                <u>Remember: email them directly at ${email}</u>
                </body>
        </HTML>`,
    };
  },
  bookingForClient: (
    clientEmail,
    { productId, timeslot, firstName, lastName, couponCode, amount }
  ) => {
    product = productId === 1 ? "Full Assessment" : "Pre-Assessment";
    return {
      from: process.env.EMAIL_SITE,
      to: clientEmail,
      subject: `Klover-Health: booking confirmation`,
      html: `<HTML>
            <body>
                <h3>Klover-Health: Booking Confirmation</h3>
                <p>Dear ${firstName} ${lastName}, <br/>
                <br/>
              This is an automated email to confirm that you have booked a <b>${product.toUpperCase()}</b> at <b>${formatUTCForEmail(
        timeslot
      )}</b>.</span><br/>
                You have paid £${numToPrice(
                  amount
                )} and will recieve an email reciept from Stripe.<br/>
                ${
                  productId === 2
                    ? `If you choose to purchase a full-assessment later, use this code to deduct what you have already paid: <b>${couponCode}</b><br/><br/>`
                    : ""
                }
                <br/>If you need to change your appointment time or have any enquiries, please make contact via the "Get In Touch" form on the Klover Health website.
                
              
                </p>
                </body>
        </HTML>`,
    };
  },
  payLinkConfirmation: (richaEmail, { clientEmail, amount }) => {
    return {
      from: process.env.EMAIL_SITE,
      to: richaEmail,
      subject: `Klover: paid through paylink!`,
      html: `<HTML>
            <body>
            <div></div>
                <h2>Payment Confirmation</h2>
           <p> You have been paid through a payment link that you shared. <br/>
           <br/>
           Paid: <b>£${numToPrice(amount)}</b> <br/>
            Client Email: <b>${clientEmail}</b> <br/>
            <br/>
            <br/>
                <u>Remember: email them directly at ${clientEmail}</u></p>
                </body>
        </HTML>`,
    };
  },
};

module.exports = emailTemplates;
