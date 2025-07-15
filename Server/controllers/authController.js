const User = require("../models/User");
const jwtUtils = require("../utils/jwtUtils");
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

    // Check if phone number already exists
    const existingPhoneNumber = await User.findOne({ number });
    if (existingPhoneNumber) {
      return res
        .status(400)
        .json({ success: false, message: "Phone number already in use!" });
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

    res.status(200).json({ success: true, user, token });
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

    if (!user.isVerified) {
      const token = jwtUtils.generateToken({
        email: user.email,
        _id: user._id,
      });
      const welcomeEmail = {
        from: '"Cord & Brushes" <noreply@cord&brushes.com>', // Replace with your actual email address
        to: email,
        subject: "Please Verify Your Email",
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; box-sizing: border-box;">
        <img src="https://i.postimg.cc/gkpN5gXQ/logo.png" alt="Logo" style="display: block; margin: 0 auto; height: 80px; width: auto;">
        <div style="margin-top: 30px; text-align: center;">
        <h2>Please Verify Your Email Address</h2>
          <p style="color: #666; line-height: 1.6;">Thank you for registering on our website. We're excited to have you join us.</p>
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

      return res
        .status(200)
        .json({ message: "Verification link sent to your email!" });
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
