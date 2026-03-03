const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // Ensures password isn't returned in 'find' queries by default
    },
    contact: {
      type: String,
      required: [true, "Contact is required"],
      //   unique: true,
      trim: true,
    },
    countryCode: {
      type: String,
      required: [true, "Country code is required"],
      default: "+91", // Assuming India first as a default
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    otp: {
      type: String,
    },
    otpExpiresAt: {
      type: Date,
      default: () => Date.now() + 5 * 60 * 1000, // 5 minutes
    },
    profileImage: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

// Exporting as a schema
module.exports = userSchema;
