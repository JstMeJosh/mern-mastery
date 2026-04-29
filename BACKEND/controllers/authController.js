import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ message: "User Already Exist" });
    }
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    const hashPassword = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashPassword, otp, otpExpiry });
    await sendEmail(
      email,
      "Verify Your Account - MERN MASTERY",
      `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
    <div style="background-color: #3b82f6; padding: 20px; text-align: center;">
      <h1 style="color: white; margin: 0; letter-spacing: 1px;">MERN MASTERY</h1>
    </div>

    <div style="padding: 40px 20px; text-align: center; background-color: #ffffff;">
      <h2 style="color: #1e293b; margin-top: 0;">Verify Your Account</h2>
      <p style="color: #64748b; line-height: 1.6;">
        Welcome to the community! To complete your registration and start building, please use the verification code below.
      </p>

      <div style="margin: 30px 0;">
        <div style="display: inline-block; padding: 15px 30px; background-color: #f8fafc; border: 2px dashed #3b82f6; border-radius: 8px;">
          <span style="font-size: 32px; font-weight: bold; color: #ef4444; letter-spacing: 8px;">
            ${otp}
          </span>
        </div>
        <p style="font-size: 12px; color: #94a3b8; margin-top: 10px;">This code expires in 10 minutes.</p>
      </div>

      <p style="color: #64748b; font-size: 14px;">
        If you didn't sign up for MERN Mastery, you can safely ignore this email.
      </p>
    </div>

    <div style="background-color: #f1f5f9; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
      <p style="margin: 0; font-size: 12px; color: #22c55e; font-weight: bold;">
        &bull; Secure Onboarding Active &bull;
      </p>
    </div>
  </div>
  `,
    );
    return res
      .status(201)
      .json({ message: `${name} has be created successfully` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email: email });
    if (!existingUser) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }
    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }
    const token = jwt.sign(
      { userId: existingUser._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN },
    );
    res.status(200).json({ message: "login successful", token: token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const existing = await User.findOne({ email });
    if (!existing) {
      return res.status(400).json({ message: "not a registered user" });
    }
    if (otp !== existing.otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    if (Date.now() > existing.otpExpiry) {
      return res.status(400).json({ message: "OTP EXPIRED" });
    }
    existing.isVerified = true;
    existing.otp = null;
    existing.otpExpiry = null;
    await existing.save();
    return res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const existingUser = await User.findOne({ email: email });
    if (!existingUser) {
      return res.status(400).json({ message: "Not a registered user" });
    }
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000);
    existingUser.resetToken = resetToken;
    existingUser.resetTokenExpiry = resetTokenExpiry;
    await sendEmail(
      email,
      "Reset Your Password - MERN MASTERY",
      `<div style="font-family: sans-serif; padding: 20px; text-align: center; border: 1px solid #e5e7eb; border-radius: 8px;">
  <h2 style="color: #1e293b;">MERN MASTERY</h2>
  <p style="color: #64748b;">You requested a password reset. Click the button below to secure your account.</p>
  
  <div style="margin: 30px 0;">
    <a href="http://localhost:5173/reset-password/${resetToken}" 
       style="background-color: #3b82f6;
              color: white; 
              padding: 12px 24px; 
              text-decoration: none; 
              border-radius: 5px; 
              font-weight: bold;
              display: inline-block;">
       Reset Your Password
    </a>
  </div>

  <p style="font-size: 12px; color: #94a3b8;">
    If you didn't request this, please ignore this email. <br>
    <span style="color: #22c55e;">Status: Secure Protocol Enabled</span>
  </p>
</div>`,
    );
    await existingUser.save();
    return res
      .status(200)
      .json({ message: `reset password sent to ${email} successfully` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    const existingToken = await User.findOne({ resetToken: token });
    if (!existingToken) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }
    if (Date.now() > existingToken.resetTokenExpiry) {
      return res.status(400).json({ message: "Expired token" });
    }
    const newHashPassword = await bcrypt.hash(password, 10);
    existingToken.password = newHashPassword;
    existingToken.resetToken = null;
    existingToken.resetTokenExpiry = null;
    await existingToken.save();
    return res
      .status(200)
      .json({ message: "password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
