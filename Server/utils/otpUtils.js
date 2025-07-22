const crypto = require("crypto");

// Generate a 6-digit OTP
const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

// Set OTP expiry time (5 minutes from now)
const setOTPExpiry = () => {
  return new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
};

// Check if OTP is expired
const isOTPExpired = (expiryTime) => {
  return new Date() > new Date(expiryTime);
};

// Validate OTP format (6 digits)
const validateOTPFormat = (otp) => {
  return /^\d{6}$/.test(otp);
};

module.exports = {
  generateOTP,
  setOTPExpiry,
  isOTPExpired,
  validateOTPFormat,
};
