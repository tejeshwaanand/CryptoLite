const nodemailer = require('nodemailer');

// Configure the transporter for your email service
const transporter = nodemailer.createTransport({
   
  secure: 'true',
  host: 'smtp.gmail.com',
  port:'465',
  service: 'gmail', // Replace with your email provider (Gmail, SendGrid, etc.)
  auth: {
    user: process.env.EMAIL_USER, // Your email address (can be set in .env)
    pass: process.env.EMAIL_PASS, // Your email password or an app password (can be set in .env)
  },
});

// Function to send the alert email
const sendAlertEmail = (userEmail, coinId, currentPrice, msg) => {
  const mailOptions = {
    from: process.env.EMAIL_USER, // Sender address
    to: userEmail, // Recipient address
    subject: `Price Alert: ${coinId}`, // Email subject
    text: `The current price of ${coinId} is $${currentPrice}. Your alert condition has been met!.  ${msg}`, // Email body
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending alert email:', error);
      return;
    }
    console.log('Alert email sent:', info.response);
  });
};

module.exports = { sendAlertEmail };
