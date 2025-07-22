const mongoose = require("mongoose");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 6,
  },
  number: {
    type: String,
    trim: true,
    unique: true,
    sparse: true,
    required: true,
  },
  address: {
    type: String,
    trim: true,
    default: "",
  },
  profilePic: {
    type: String, // URL or path to the profile picture
    default: "",
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isPhoneVerified: {
    type: Boolean,
    default: false,
  },
  phoneOTP: {
    type: String,
    default: null,
  },
  phoneOTPExpiry: {
    type: Date,
    default: null,
  },
});

module.exports = mongoose.model("User", userSchema);
