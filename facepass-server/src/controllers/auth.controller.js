const prisma = require("../utils/prisma");
const generateOTP = require("../utils/generateOtp");
const transporter = require("../services/email.service");
const isCollegeEmail = require("../utils/isCollegeEmail");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email required"
      });
    }

    if (!isCollegeEmail(email)) {
      return res.status(400).json({
        message: "Use college email"
      });
    }

    const otp = generateOTP();

    await prisma.verificationCode.create({
      data: {
        email,
        otp,
        expiresAt: new Date(
          Date.now() + 5 * 60 * 1000
        )
      }
    });

    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: email,
          subject: "FacePass OTP",
          text: `Your OTP is ${otp}`
        });
      } catch (emailError) {
        console.error("Failed to send email, but OTP was generated.", emailError);
        console.log(`\n================================`);
        console.log(`[DEV MODE] OTP for ${email}: ${otp}`);
        console.log(`================================\n`);
      }
    } else {
      console.log(`\n================================`);
      console.log(`[DEV MODE] OTP for ${email}: ${otp}`);
      console.log(`================================\n`);
    }

    return res.status(200).json({
      message: "OTP Sent"
    });

  } catch (error) {
    console.error("Database or Server Error:", error);

    return res.status(500).json({
      message: "Server Error: " + error.message
    });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const verification = await prisma.verificationCode.findFirst({
      where: { email, otp },
      orderBy: { expiresAt: 'desc' }
    });

    if (!verification || verification.expiresAt < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (user) {
      // User exists, log them in
      await prisma.verificationCode.deleteMany({ where: { email } });
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
      return res.status(200).json({
        message: "Login successful",
        isRegistered: true,
        token,
        user
      });
    } else {
      // User doesn't exist, tell frontend to register
      return res.status(200).json({
        message: "OTP verified. Please register.",
        isRegistered: false
      });
    }

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

exports.register = async (req, res) => {
  try {
    const { email, otp, name, rollNumber, department, year } = req.body;

    if (!email || !otp || !name || !rollNumber) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Verify OTP again
    const verification = await prisma.verificationCode.findFirst({
      where: { email, otp },
      orderBy: { expiresAt: 'desc' }
    });

    if (!verification || verification.expiresAt < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { rollNumber }]
      }
    });

    if (existingUser) {
      return res.status(400).json({ message: "User with this email or roll number already exists" });
    }

    // Create user
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        rollNumber,
        department,
        year: year ? parseInt(year) : null,
        verified: true
      }
    });

    // Clean up OTPs
    await prisma.verificationCode.deleteMany({ where: { email } });

    // Generate JWT
    const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, { expiresIn: '7d' });

    return res.status(201).json({
      message: "Registration successful",
      token,
      user: newUser
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};