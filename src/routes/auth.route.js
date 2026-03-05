const express = require("express");
const {
  loginUserByPassword,
  loginUserByOtp,
  sendLoginOtp,
  forgotPassword,
  resetPassword,
  updateProfile,
  registerUser,
} = require("../controllers/auth.controller");
const {
  registerLimiter,
  loginLimiter,
  otpLimiter,
  resendOtpLimiter,
  forgotPasswordLimiter,
  restrictTo,
  protect,
} = require("../utility/middleware/auth.middleware");
const { upload } = require("../utility/middleware/multer.middleware");
const router = express.Router();

// test api
router.get("/", (req, res) => {
  res.json({ message: "Welcome to the People Book Management System" });
});

// register api
router.post(
  "/register",
  registerLimiter,
  upload.single("profileImage"),
  registerUser,
);
// login api password | send otp | login otp
router.post("/send_login_otp", otpLimiter, sendLoginOtp);
router.post("/login_otp", loginUserByOtp);
router.post("/login_password", loginLimiter, loginUserByPassword);
// forgot password
router.post("/forgot_password", forgotPasswordLimiter, forgotPassword);
// reset password
router.post("/reset_password", resendOtpLimiter, resetPassword);

// Any logged-in user can update their profile
router.patch(
  "/update-profile",
  protect,
  upload.single("profileImage"),
  updateProfile,
);
module.exports = router;
