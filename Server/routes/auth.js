const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/register", authController.register);

router.post("/login", authController.login);

router.get("/users", authController.getAllUsers);

router.post("/forgot-password", authController.forgotPassword);

router.get("/verify-email/:token", authController.verifyEmail);

router.get("/reset-password/:id/:token", authController.resetPasswordGet);

router.put("/reset-password/:id/:token", authController.resetPasswordPut);

// Phone verification routes
router.post("/send-phone-otp", authController.sendPhoneOTP);
router.post("/verify-phone-otp", authController.verifyPhoneOTP);
router.post("/resend-phone-otp", authController.resendPhoneOTP);

// Pre-registration phone verification routes
router.post(
  "/send-pre-registration-otp",
  authController.sendPreRegistrationOTP
);
router.post(
  "/verify-pre-registration-otp",
  authController.verifyPreRegistrationOTP
);

// Update user profile
router.put("/profile", authMiddleware, authController.updateProfile);

module.exports = router;
