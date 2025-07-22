const express = require("express");
const router = express.Router();
const ContactMessage = require("../models/ContactMessage");
const nodemailer = require("nodemailer");

// Configure your transporter (use environment variables for real projects)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USERNAME, // replace with your email
    pass: process.env.EMAIL_PASSWORD, // use an app password, not your main password
  },
});

router.post("/", async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    // 1. Store in database
    const newMessage = new ContactMessage({ name, email, message });
    await newMessage.save();

    // 2. Send email notification
    const mailOptions = {
      from: email,
      to: process.env.EMAIL_USERNAME, // replace with your email
      subject: `New Contact Form Submission from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "Message received and email sent!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
});

module.exports = router;
