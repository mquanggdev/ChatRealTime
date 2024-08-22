
const nodemailer = require('nodemailer');
const { emit } = require('../models/user.model');

module.exports.sendMail = (email , subject , html) => {
    const transporter = nodemailer.createTransport({
        service:"gmail",
        auth: {
          user: process.env.SEND_MAIL_EMAIL,
          pass: process.env.SEND_MAIL_PASSWORD,
        }
      });
      
      // Configure the mailoptions object
      const mailOptions = {
        from: process.env.SEND_MAIL_EMAIL,
        to: email,
        subject: subject,
        html: html
      };
      
      // Send the email
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(`Error:`, error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
}