const User = require("../models/User");
const jwtUtils = require("../utils/jwtUtils");
const otpUtils = require("../utils/otpUtils");
const smsUtils = require("../utils/smsUtils");
const argon2 = require("argon2");
const nodemailer = require("nodemailer");

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, number } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists!" });
    }

    // Check if phone number already exists (excluding temporary users)
    const existingPhoneNumber = await User.findOne({
      number,
      email: { $not: /^temp_/ }, // Exclude temporary users
    });
    if (existingPhoneNumber) {
      return res
        .status(400)
        .json({ success: false, message: "Phone number already in use!" });
    }

    // Find and clean up temporary user if exists
    const tempUser = await User.findOne({
      number,
      email: { $regex: /^temp_/ },
    });

    if (tempUser) {
      // If temporary user exists and is phone verified, use that verification
      if (tempUser.isPhoneVerified) {
        // Delete the temporary user
        await User.findByIdAndDelete(tempUser._id);
      } else {
        return res.status(400).json({
          message: "Please verify your phone number first",
        });
      }
    }

    // Hash password
    const hashedPassword = await argon2.hash(password);

    // Create new User
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      number,
      isPhoneVerified: true, // since verified before registration
    });
    await user.save();

    // Generate a JWT for the user
    const token = jwtUtils.generateToken(
      {
        _id: user._id,
        role: user.role,
        email: user.email,
      },
      "7d"
    );

    // Send welcome email
    const welcomeEmail = {
      from: '"Cord & Brushes" <noreply@cors&brushes.com>',
      to: email,
      subject: "Welcome to Cord & Brushes",
      text: `Welcome! Please verify your email by clicking this link: ${process.env.BASE_URL}/api/auth/verify-email/${token}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; box-sizing: border-box;">
          <img src="https://i.postimg.cc/gkpN5gXQ/logo.png" alt="Logo" style="display: block; margin: 0 auto; height: 80px; width: auto;">
          <div style="margin-top: 30px; text-align: center;">
            <h2 style="color: #007BFF; margin-bottom: 20px;">Welcome ${name}!</h2>
            <p style="color: #666; line-height: 1.6;">Thank you for registering on our website. We're excited to have you join us.</p>
          </div>
          <div style="padding: 20px; background-color: #f9f9f9; border-radius: 5px; margin-top: 30px">
            <div style="text-align: center;">
              <p style="font-size: 18px; margin-bottom: 10px;">Please verify your email address by clicking the link below:</p>
              <a href="${process.env.BASE_URL}/api/auth/verify-email/${token}" style="cursor: pointer; background-color: #007BFF; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Email</a>
            </div>
          </div>
          <div style="margin-top: 20px; text-align: center;">
            <p style="color: #999;">If you did not register, please ignore this email.</p>
          </div>
        </div>
      `,
    };

    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: String(process.env.EMAIL_USERNAME),
        pass: String(process.env.EMAIL_PASSWORD),
      },
    });

    transporter.sendMail(welcomeEmail, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    res.status(200).json({
      success: true,
      user,
      token,
      message: "Registration successful! Please verify your email.",
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwtUtils.verifyToken(token);
    console.log(decoded);

    const user = await User.findById(decoded._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isVerified = true;
    await user.save();
    const redirectUrl = `${process.env.CLIENT_URL}/auth/login?verified=true`;
    res.redirect(redirectUrl);
  } catch (error) {
    console.error(error);
    res.status(401).send("Verification failed!");
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid ! User not found with these credentials." });
    }

    if (!user.isVerified || !user.isPhoneVerified) {
      const token = jwtUtils.generateToken({
        email: user.email,
        _id: user._id,
      });

      let verificationMessage = "";
      if (!user.isVerified && !user.isPhoneVerified) {
        verificationMessage = "Please verify both your email and phone number.";
      } else if (!user.isVerified) {
        verificationMessage = "Please verify your email address.";
      } else if (!user.isPhoneVerified) {
        verificationMessage = "Please verify your phone number.";
      }

      const welcomeEmail = {
        from: '"Cord & Brushes" <noreply@cord&brushes.com>',
        to: email,
        subject: "Please Verify Your Account",
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; box-sizing: border-box;">
        <img src="https://postimg.cc/ThnMkN0B" alt="Logo" style="display: block; margin: 0 auto; height: 80px; width: auto;">
        <div style="margin-top: 30px; text-align: center;">
        <h2>Please Verify Your Account</h2>
          <p style="color: #666; line-height: 1.6;">${verificationMessage}</p>
        </div>
        <div style="padding: 20px; background-color: #f9f9f9; border-radius: 5px; margin-top: 30px">
          <div style="text-align: center;">
            <p style="font-size: 18px; margin-bottom: 10px;">We received a login attempt from your email address but couldn't verify it yet. Please click the link below to verify your email:</p>
            <a href="${process.env.BASE_URL}/api/auth/verify-email/${token}" style="cursor: pointer; background-color: #007BFF; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Email</a>
          </div>
        </div>
        <div style="margin-top: 20px; text-align: center;">
          <p style="color: #999;">If you did not register, please ignore this email.</p>
        </div>
      </div>
        `,
      };
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: String(process.env.EMAIL_USERNAME),
          pass: String(process.env.EMAIL_PASSWORD),
        },
      });

      transporter.sendMail(welcomeEmail, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });

      return res.status(200).json({
        message: verificationMessage,
        needsEmailVerification: !user.isVerified,
        needsPhoneVerification: !user.isPhoneVerified,
      });
    }

    // Compare the password with hashed password
    const isMatch = await argon2.verify(user.password, password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password!" });
    }

    // Generate a JWT for the user
    const token = jwtUtils.generateToken({
      _id: user._id,
      role: user.role,
      email: user.email,
    });
    res.json({ success: true, user, token });
  } catch (err) {
    res.status(500).json({ message: "Server Error!" });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "No account with that email address exists." });
    }

    // Generate a random token
    const token = jwtUtils.generateToken({ email: user.email, id: user._id });

    const link = `${process.env.CLIENT_URL}/auth/reset-password/${user._id}/${token}`;
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: String(process.env.EMAIL_USERNAME),
        pass: String(process.env.EMAIL_PASSWORD),
      },
    });

    var mailOptions = {
      from: '"Cord & Brushes" <noreply@cord&brushes.com>',
      to: email,
      subject: "Password Reset Request",
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; box-sizing: border-box;">
      <img src="https://i.postimg.cc/gkpN5gXQ/logo.png" alt="Logo" style="display: block; margin: 0 auto; height: 80px; width: auto;">
      <div style="margin-top: 30px; text-align: center;">
        <h2 style="margin-bottom: 20px;">Welcome Back!</h2>
        <p style="color: #666; line-height: 1.6;">Your request to reset your password has been processed.</p>
      </div>
      <div style="padding: 20px; background-color: #f9f9f9; border-radius: 5px; margin-top: 30px">
        <div style="text-align: center;">
          <p style="font-size: 18px; margin-bottom: 10px;">Click the button below to reset your password:</p>
          <a href="${link}" style="cursor: pointer; background-color: #007BFF; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
        </div>
      </div>
      <div style="margin-top: 20px; text-align: center;">
        <p style="color: #999;">If you didn't request a password reset, no action is required on your part.</p>
      </div>
    </div>
          `,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email send: " + info.response);
      }
    });
    console.log(link);
    res.status(200).json({ message: "Password reset email has been sent." });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

exports.resetPasswordGet = async (req, res) => {
  const { id, token } = req.params;

  try {
    // First find user to avoid unnecessary token verification
    const user = await User.findOne({ _id: id });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    try {
      // Verify token
      const decoded = jwtUtils.verifyToken(token);

      // Verify that the token's email matches the user's email
      if (decoded.email !== user.email) {
        return res.status(401).json({ message: "Invalid token." });
      }

      // If everything is valid, redirect to the frontend reset password page
      const redirectUrl = `${process.env.CLIENT_URL}/auth/reset-password/${user._id}/${token}`;
      return res.redirect(redirectUrl);
    } catch (tokenError) {
      console.error("Token verification error:", tokenError);
      // If token is invalid or expired, redirect to frontend with error
      const errorUrl = `${process.env.CLIENT_URL}/auth/reset-password-error`;
      return res.redirect(errorUrl);
    }
  } catch (error) {
    console.error("Error in resetPasswordGet:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.resetPasswordPut = async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  const user = await User.findOne({ _id: id });
  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  try {
    const decoded = jwtUtils.verifyToken(token);
    console.log(decoded);
  } catch (error) {
    console.log(error);
    res.json({ status: "Something went wrong!" });
  }

  const hashedPassword = await argon2.hash(password);
  await User.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        password: hashedPassword,
      },
    }
  );
  res
    .status(200)
    .json({ message: "Password updated successfully!", status: "Verified!" });
};

// Send OTP to phone number for pre-registration verification
exports.sendPreRegistrationOTP = async (req, res) => {
  try {
    const { number } = req.body;

    if (!number) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    // Validate phone number format (10 digits)
    if (!/^\d{10}$/.test(number)) {
      return res
        .status(400)
        .json({ message: "Phone number must be 10 digits" });
    }

    // Check if phone number already exists
    const existingUser = await User.findOne({ number });
    if (existingUser) {
      return res.status(400).json({ message: "Phone number already in use!" });
    }

    // Create a temporary user for OTP verification
    const tempUser = new User({
      name: "temp_" + Date.now(),
      email: "temp_" + Date.now() + "@temp.com",
      password: "temp_password",
      number: number,
      role: "user",
    });

    // Generate OTP
    const otp = otpUtils.generateOTP();
    const otpExpiry = otpUtils.setOTPExpiry();

    // Save OTP to temporary user
    tempUser.phoneOTP = otp;
    tempUser.phoneOTPExpiry = otpExpiry;
    await tempUser.save();

    // Send OTP via SMS
    try {
      await smsUtils.sendOTP(number, otp);
      res.status(200).json({
        success: true,
        message: "OTP sent to your phone number",
        // In production, remove this line and integrate with actual SMS service
        otp: process.env.NODE_ENV === "development" ? otp : undefined,
      });
    } catch (smsError) {
      console.error("SMS sending failed:", smsError);
      res.status(500).json({
        success: false,
        message: "Failed to send OTP. Please try again.",
        // In development, still return OTP for testing
        otp: process.env.NODE_ENV === "development" ? otp : undefined,
      });
    }
  } catch (error) {
    console.error("Error sending pre-registration phone OTP:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Verify pre-registration phone OTP
exports.verifyPreRegistrationOTP = async (req, res) => {
  try {
    const { number, otp } = req.body;

    if (!number || !otp) {
      return res
        .status(400)
        .json({ message: "Phone number and OTP are required" });
    }

    // Validate OTP format
    if (!otpUtils.validateOTPFormat(otp)) {
      return res.status(400).json({ message: "Invalid OTP format" });
    }

    // Find temporary user by phone number
    const tempUser = await User.findOne({
      number,
      email: { $regex: /^temp_/ }, // Only find temporary users
    });

    if (!tempUser) {
      return res
        .status(404)
        .json({ message: "No OTP found for this phone number" });
    }

    // Check if OTP exists and is not expired
    if (!tempUser.phoneOTP || !tempUser.phoneOTPExpiry) {
      return res
        .status(400)
        .json({ message: "No OTP found. Please request a new one" });
    }

    if (otpUtils.isOTPExpired(tempUser.phoneOTPExpiry)) {
      return res
        .status(400)
        .json({ message: "OTP has expired. Please request a new one" });
    }

    // Verify OTP
    if (tempUser.phoneOTP !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Mark phone as verified and clean up temporary user
    tempUser.isPhoneVerified = true;
    tempUser.phoneOTP = null;
    tempUser.phoneOTPExpiry = null;
    await tempUser.save();

    res.status(200).json({
      success: true,
      message: "Phone number verified successfully",
    });
  } catch (error) {
    console.error("Error verifying pre-registration phone OTP:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Send OTP to phone number
exports.sendPhoneOTP = async (req, res) => {
  try {
    const { number } = req.body;

    if (!number) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    // Validate phone number format (10 digits)
    if (!/^\d{10}$/.test(number)) {
      return res
        .status(400)
        .json({ message: "Phone number must be 10 digits" });
    }

    // Check if user exists with this phone number
    const user = await User.findOne({ number });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found with this phone number" });
    }

    // Generate OTP
    const otp = otpUtils.generateOTP();
    const otpExpiry = otpUtils.setOTPExpiry();

    // Save OTP to user
    user.phoneOTP = otp;
    user.phoneOTPExpiry = otpExpiry;
    await user.save();

    // Send OTP via SMS
    try {
      await smsUtils.sendOTP(number, otp);
      res.status(200).json({
        success: true,
        message: "OTP sent to your phone number",
        // In production, remove this line and integrate with actual SMS service
        otp: process.env.NODE_ENV === "development" ? otp : undefined,
      });
    } catch (smsError) {
      console.error("SMS sending failed:", smsError);
      res.status(500).json({
        success: false,
        message: "Failed to send OTP. Please try again.",
        // In development, still return OTP for testing
        otp: process.env.NODE_ENV === "development" ? otp : undefined,
      });
    }
  } catch (error) {
    console.error("Error sending phone OTP:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Verify phone OTP
exports.verifyPhoneOTP = async (req, res) => {
  try {
    const { number, otp } = req.body;

    if (!number || !otp) {
      return res
        .status(400)
        .json({ message: "Phone number and OTP are required" });
    }

    // Validate OTP format
    if (!otpUtils.validateOTPFormat(otp)) {
      return res.status(400).json({ message: "Invalid OTP format" });
    }

    // Find user by phone number
    const user = await User.findOne({ number });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if OTP exists and is not expired
    if (!user.phoneOTP || !user.phoneOTPExpiry) {
      return res
        .status(400)
        .json({ message: "No OTP found. Please request a new one" });
    }

    if (otpUtils.isOTPExpired(user.phoneOTPExpiry)) {
      return res
        .status(400)
        .json({ message: "OTP has expired. Please request a new one" });
    }

    // Verify OTP
    if (user.phoneOTP !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Mark phone as verified
    user.isPhoneVerified = true;
    user.phoneOTP = null;
    user.phoneOTPExpiry = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Phone number verified successfully",
    });
  } catch (error) {
    console.error("Error verifying phone OTP:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Resend phone OTP
exports.resendPhoneOTP = async (req, res) => {
  try {
    const { number } = req.body;

    if (!number) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    // Find user by phone number
    const user = await User.findOne({ number });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate new OTP
    const otp = otpUtils.generateOTP();
    const otpExpiry = otpUtils.setOTPExpiry();

    // Save new OTP to user
    user.phoneOTP = otp;
    user.phoneOTPExpiry = otpExpiry;
    await user.save();

    // Send new OTP via SMS
    try {
      await smsUtils.sendOTP(number, otp);
      res.status(200).json({
        success: true,
        message: "New OTP sent to your phone number",
        // In production, remove this line and integrate with actual SMS service
        otp: process.env.NODE_ENV === "development" ? otp : undefined,
      });
    } catch (smsError) {
      console.error("SMS sending failed:", smsError);
      res.status(500).json({
        success: false,
        message: "Failed to send OTP. Please try again.",
        // In development, still return OTP for testing
        otp: process.env.NODE_ENV === "development" ? otp : undefined,
      });
    }
  } catch (error) {
    console.error("Error resending phone OTP:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    // Retrieve all users
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    console.error("Error in request handler:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, email, number, address } = req.body;
    const updateFields = {};
    if (name !== undefined) updateFields.name = name;
    if (email !== undefined) updateFields.email = email;
    if (number !== undefined) updateFields.number = number;
    if (address !== undefined) updateFields.address = address;
    /* if (profilePic !== undefined) updateFields.profilePic = profilePic; */

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true }
    ).select("-password -phoneOTP -phoneOTPExpiry");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
