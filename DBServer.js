require("dotenv").config();
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const { Client } = require("pg");

const app = express();
app.use(express.json());
app.use(cors());


// ✅ Nodemailer Configuration (Use Gmail App Password)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD, // Ensure this is an App Password
  },
});

// ✅ Store OTP Temporarily
let otpStorage = {};

// Send OTP Endpoint
app.post("/send-otp", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStorage[email] = { otp, timestamp: Date.now() }; // Store OTP with timestamp

  console.log(`Generated OTP for ${email}: ${otp}`);

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Your OTP for SafeSpace Authentication",
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

// Verify OTP Endpoint
app.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;
  
  if (otpStorage[email]) {
    const storedOTP = otpStorage[email];
    
    // Check OTP expiration (5 minutes)
    if (Date.now() - storedOTP.timestamp > 5 * 60 * 1000) {
      delete otpStorage[email]; // Remove expired OTP
      return res.status(400).json({ error: "OTP has expired" });
    }

    if (storedOTP.otp === otp) {
      delete otpStorage[email]; // Remove OTP after successful verification
      return res.json({ success: true });
    }
  }

  res.status(400).json({ error: "Invalid OTP" });
});


// ✅ Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, "0.0.0.0", () => console.log(`🚀 Server running on port ${PORT}`));
