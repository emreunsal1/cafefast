import mongoose, { Schema } from "mongoose";

export enum OTPType {
  EMAIL="email",
  PHONE= "phone"
}

export type OTP = {
  target: string;
  otpCode: string,
  type: OTPType;
  createdAt?: Date;
}

const otpSchema = new Schema<OTP>({
  target: String,
  otpCode: String,
  type: String,
  createdAt: { type: Date, expires: 3600, default: Date.now },
}, {
  expireAfterSeconds: 300,
});

const otpModel = mongoose.model("otp", otpSchema);

export default otpModel;
