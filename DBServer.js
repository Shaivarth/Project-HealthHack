require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { Client } = require("pg");

const app = express();
app.use(express.json());
app.use(cors());

// PostgreSQL Connection
const pgClient = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

pgClient.connect()
  .then(() => console.log("✅ Connected to PostgreSQL"))
  .catch(err => console.error("❌ PostgreSQL Connection Error:", err.stack));

// Nodemailer Configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD, // Use App Password
  },
});

let otpStorage = {}; // Temporary OTP storage

// ✅ Send OTP Endpoint
app.post("/send-otp", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStorage[email] = otp;

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Your OTP for Signup",
    text: `Your OTP is: ${otp}. It is valid for 5 minutes.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ error: "Failed to send OTP" });
  }
});

// ✅ Verify OTP Endpoint
app.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  if (otpStorage[email] && otpStorage[email] === otp) {
    delete otpStorage[email]; // Remove OTP after verification
    res.json({ success: true });
  } else {
    res.status(400).json({ error: "Invalid OTP" });
  }
});

// ✅ Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
