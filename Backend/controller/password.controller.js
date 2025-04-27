import User from "../model/user.model.js";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

// Store OTPs with expiry times (in-memory storage for simplicity)
// In production, you might want to use Redis or a database
const otpStore = new Map();

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Generate a random 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP email
const sendOTPEmail = async (email, otp) => {
  // Also log OTP to console for debugging
  console.log(`
  ====================================
  PASSWORD RESET OTP FOR ${email}
  OTP: ${otp}
  Valid for 10 minutes
  ====================================
  `);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset OTP for EDUverse",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #4f46e5; text-align: center;">EDUverse Password Reset</h2>
        <p>Hello,</p>
        <p>You have requested to reset your password. Please use the following OTP to verify your identity:</p>
        <div style="background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
          ${otp}
        </div>
        <p>This OTP is valid for 10 minutes. If you did not request a password reset, please ignore this email.</p>
        <p>Thank you,<br>EDUverse Team</p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

// Request password reset and send OTP
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Generate OTP
    const otp = generateOTP();

    // Store OTP with 10-minute expiry
    otpStore.set(email, {
      otp,
      expiry: Date.now() + 10 * 60 * 1000, // 10 minutes
    });

    // Send OTP email
    await sendOTPEmail(email, otp);

    return res.status(200).json({
      success: true,
      message: "OTP sent to your email",
    });
  } catch (error) {
    console.error("Error in forgot password:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while processing your request",
      error: error.message,
    });
  }
};

// Verify OTP
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    // Check if OTP exists and is valid
    const otpData = otpStore.get(email);

    if (!otpData) {
      return res.status(400).json({
        success: false,
        message: "OTP not found or expired. Please request a new one.",
      });
    }

    // Check if OTP is expired
    if (Date.now() > otpData.expiry) {
      otpStore.delete(email);
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new one.",
      });
    }

    // Verify OTP
    if (otpData.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // OTP is valid, but don't delete it yet (needed for password reset)
    // Just mark it as verified
    otpStore.set(email, {
      ...otpData,
      verified: true,
    });

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.error("Error in verify OTP:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while verifying OTP",
      error: error.message,
    });
  }
};

// Reset password
export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Email and new password are required",
      });
    }

    // Check if OTP was verified
    const otpData = otpStore.get(email);

    if (!otpData || !otpData.verified) {
      return res.status(400).json({
        success: false,
        message: "OTP verification required before resetting password",
      });
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    user.password = hashedPassword;
    await user.save();

    // Clear OTP data
    otpStore.delete(email);

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Error in reset password:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while resetting password",
      error: error.message,
    });
  }
};

// Resend OTP
export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Generate new OTP
    const otp = generateOTP();

    // Store OTP with 10-minute expiry
    otpStore.set(email, {
      otp,
      expiry: Date.now() + 10 * 60 * 1000, // 10 minutes
    });

    // Send OTP email
    await sendOTPEmail(email, otp);

    return res.status(200).json({
      success: true,
      message: "OTP resent to your email",
    });
  } catch (error) {
    console.error("Error in resend OTP:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while resending OTP",
      error: error.message,
    });
  }
};
