const formatUTCForEmail = require("../util/formatUTCForEmail");
const numToPrice = require("../util/numToPrice");

const getProductName = (productId) => {
  return productId === 1
    ? "In-Person Assessment"
    : productId === 2
    ? "Remote Assessment"
    : "GP Letter";
};

const emailTemplates = {
  contact: (richaEmail, { name, email, tel, message }) => {
    return {
      from: process.env.EMAIL_SITE,
      to: richaEmail,
      subject: `Klover: Message from ${name}`,
      html: `<HTML>
            <body>
                <h3>You have been contacted on Klover Healthcare!</h3>
                Name: <b>${name} </b><br/>
                Email: <b>${email} </b> <br/>
                Phone: <b>${tel}</b> <br/>
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
    console.log(productId);

    return {
      from: process.env.EMAIL_SITE,
      to: richaEmail,
      subject: `Klover: ${getProductName(productId)} booked!`,
      html: `<HTML>
            <body>
                <h2>Booking Confirmation</h2>
                <p>What: <b>${getProductName(productId).toUpperCase()}</b><br/>
               ${
                 productId === 1 || productId === 2
                   ? `When: <b>${formatUTCForEmail(timeslot)}</b><br/>`
                   : ""
               }
            Paid: <b>£${numToPrice(amount)}</b></p>
                
                <h3>Customer Details</h3>  
              <p> Name: <b>${firstName} ${lastName}</b><br/>
               Email: ${email}</b><br/>
               Phone: <b>${phone}</b>
                ${
                  productId === 2 && couponCode.length > 1
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
    console.log(productId);
    return {
      from: process.env.EMAIL_SITE,
      to: clientEmail,
      subject: `Klover-Health: booking confirmation`,
      html: `<HTML>
            <body>
                <h3>Klover Healthcare Booking Confirmation</h3>
                <p>Dear ${firstName} ${lastName}, <br/>
                <br/>
              This is an automated email to confirm that you have ${
                productId === 1 || productId === 2 ? "booked" : "paid for"
              } a <b>${getProductName(productId).toUpperCase()}</b>${
        productId === 1 || productId === 2
          ? ` at <b>${formatUTCForEmail(timeslot)}</b>`
          : ""
      }.</span><br/>
                You have paid £${numToPrice(
                  amount
                )} and will recieve an email reciept from Stripe.<br/>
                ${
                  productId === 2 && couponCode.length > 1
                    ? `If you choose to purchase a full-assessment later, use this code to deduct what you have already paid: <b>${couponCode}</b><br/><br/>`
                    : ""
                }
                <br/>If you have any enquiries, please make contact via the <a href="https://www.kloverhealthcare.com/#contact">"Get In Touch"</a> form on the Klover Health website.
                
              
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
