const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

app.use(bodyParser.json());

// Store the generated OTPs in an object with the user's email as the key
let otpStore = {};

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'akshu8641@gmail.com',
    pass: 'kfordpahyvpjnser'
  }
});

app.post('/generate_otp/:email', (req, res) => {
  const email = req.params.email;
  const otp = Math.floor(100000 + Math.random() * 900000);
  otpStore[email] = otp;
  const mailOptions = {
    from: 'akshu8641@gmail.com',
    to: 'bhardwajakshay14@gmail.com',
    subject: 'OTP for verification',
    text: `Your OTP is: ${otp}`
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.status(500).send({ message: 'Error sending OTP email' });
    } else {
      res.status(200).send({ message: `OTP sent to ${email}` });
    }
  });
});

app.post('/verify_otp/:email', (req, res) => {
  const email = req.params.email;
  const receivedOtp = req.body.otp;
  if (otpStore[email] === receivedOtp) {
    res.status(200).send({ message: 'OTP verified successfully' });
  } else {
    res.status(400).send({ message: 'Incorrect OTP' });
  }
});

app.listen(3000, () => console.log('OTP verification API listening on port 3000!'));
