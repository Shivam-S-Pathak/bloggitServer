import mongoose from "mongoose";

const otpSchema = mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

const otpData = mongoose.model("otpData", otpSchema);

export default otpData;
