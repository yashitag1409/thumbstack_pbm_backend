require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { model } = require("mongoose");

const userSchema = require("../schema/user.schema");

userSchema.methods.generateToken = function () {
  const token = jwt.sign(
    {
      id: this._id,
      username: this.name,
      email: this.email,
      contact: this.contact,
      role: this.role,
    },
    process.env.JWT_SECRET_KEY, //jwt secret key
    {
      expiresIn: process.env.JWT_EXPIRY_DURATION || "10d", // jwt expiry time
    },
  );
  return token;
};

// encoding passowrd by 16 rounds
userSchema.methods.hashingPassword = async function (password) {
  const salt = await bcrypt.genSalt(16);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

// decoding passowrd
userSchema.methods.decodingPassword = async function (user_password) {
  //   decoding password
  const isMatch = await bcrypt.compare(user_password, this.password);
  return isMatch;
};

// generate OTP
userSchema.methods.generateOtpAndSave = async function () {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const hashedOtp = await bcrypt.hash(otp, 10);
  this.otp = hashedOtp;
  this.otpExpiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

  await this.save();

  console.log(otp);

  return otp; // return non-hashed OTP to send via email/SMS
};

// 🔹 Validate OTP
userSchema.methods.verifyOtp = async function (otpFromUser) {
  if (!this.otp) return false;

  // 1️⃣ Check expiry
  if (this.otpExpiresAt < Date.now()) return "expired";

  // 2️⃣ Compare OTP using bcrypt
  const isMatch = await bcrypt.compare(otpFromUser, this.otp);
  if (!isMatch) return false;

  return true;
};

const USERMODEL = model("user", userSchema);

module.exports = USERMODEL;
