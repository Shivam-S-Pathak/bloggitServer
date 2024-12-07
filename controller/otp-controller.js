import otpData from "../model/otp.js";
import crypto from "crypto";
import nodemailer from "nodemailer";

import dotenv from "dotenv";

dotenv.config();

const generateOtp = () => {
  return crypto.randomInt(100000, 999999).toString();
};

//send email for otp

const sendEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `"Form BloggIT" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
  });
};

export const saveOtp = async (email) => {
  const otp = generateOtp();
  const expiresAt = new Date(Date.now() + process.env.OTP_EXPIRY_TIME);

  await otpData.create({ email, otp, expiresAt });
  await sendEmail(email, otp);
};

export const sendOtp = async (request, response) => {
  const { email } = request.body;
  console.log("this is from the sendopt function ", email);
  if (!email)
    return response.status(400).json({ message: "Email is required" });
  try {
    await saveOtp(email);
    response.status(200).json({ message: "OTP sent to email" });
  } catch (error) {
    response.status(500).json({ message: "Error sending OTP", error });
  }
};

export const verifyOtp = async (request, reponse) => {
  const { email, otp } = request.body;
  if (!email || !otp)
    return response.status(400).json({ message: "Email and OTP are required" });

  const record = await otpData.findOne({ email, otp });
  if (!record) return res.status(400).json({ message: "Invalid OTP" });

  if (new Date() > record.expiresAt)
    return response.status(400).json({ message: "OTP expired" });

  await otpData.deleteMany({ email });
  res.status(200).json({ message: "OTP verified, proceed with signup" });
};
