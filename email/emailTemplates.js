const emailTemplates = {
  contact: (clientEmail, { custName, custEmail, custMessage }) => {
    return {
      from: process.env.EMAIL_SITE,
      to: clientEmail,
      subject: `Klover: Message from ${custName}`,
      html: `<HTML>
            <body>
                <h3>You have been contacted on Klover Healthcare!</h3>
                <b>Name:</b> ${custName} <br/>
                <b>Email:</b> ${custEmail} <br/>
                <br/>
                <b>Message:</b> <br/>
                ${custMessage}

                <br/>
                <br/>
                <b><u>Remember:</u> email them back directly at ${custEmail}</b>
            </body>
        </HTML>`,
    };
  },
  booking: (
    clientEmail,
    { product, amount, time, custName, custEmail, custPhone, couponId }
  ) => {
    return {
      from: process.env.EMAIL_SITE,
      to: clientEmail,
      subject: `Klover: ${product} booked by ${custName}`,
      html: `<HTML>
            <body>
                <h2>Booking Confirmation</h2>
                <p>A <u>${product}</u> has been booked for <u>${time}</u> (UK time).</p>
                <p><u>£${amount}</u> has been paid.</p>
                <h3>Customer Details:</h3>
                
                <b>Name:</b> ${custName}<br/>
                <b>Email:</b> ${custEmail}<br/>
                <b>Phone:</b> ${custPhone}<br/>
                ${couponId ? `<b>Coupon code:</b> ${couponId}` : ``}

                </body>
        </HTML>`,
    };
  },
};

module.exports = emailTemplates;
