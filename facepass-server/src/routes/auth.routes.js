const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");

const {
  sendOtp,
  verifyOtp,
  register,
  getMe
} = require("../controllers/auth.controller");

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/register", register);
router.get("/me", authMiddleware, getMe);

module.exports = router;