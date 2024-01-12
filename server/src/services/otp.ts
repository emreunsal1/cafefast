import { FilterQuery } from "mongoose";

import logger from "../utils/logger";
import otpModel, { OTP, OTPType } from "../models/otp";
import { OTP_REQUIRED_TIMEOUT_AS_MS } from "../constants";

const createOtp = async (otpData: OTP) => {
  const result = await otpModel.create(otpData);
  return result;
};

const generateRandomFiveDigitOtp = () => (Math.floor(Math.random() * 90000) + 10000).toString();

export const sendOtp = async ({ target, type }) => {
  // TODO: implement otp for stage env
  // TODO: implement otp provider
  const randomOtp = "00000";

  await createOtp({ target, type, otpCode: randomOtp });
};

export const getOtp = async (otpQuery: FilterQuery<OTP>) => {
  const result = await otpModel.findOne(otpQuery);
  return result;
};

export const checkUserNeedOtp = (shopperLastOtpDate) => {
  const isOtpRequired = !shopperLastOtpDate || (Date.now() - shopperLastOtpDate) > OTP_REQUIRED_TIMEOUT_AS_MS;
  return isOtpRequired;
};

export const checkOtpIsValid = async ({
  shopperId, shopperPhone, shopperLastOtpDate, otp,
}) => {
  try {
    const isOtpRequired = checkUserNeedOtp(shopperLastOtpDate);
    if (!isOtpRequired) {
      return true;
    }

    const lastOtpOfPhoneNumber = await getOtp({
      target: shopperPhone, type: OTPType.PHONE, otpCode: otp,
    });
    return lastOtpOfPhoneNumber;
  } catch (err) {
    logger.error({
      stack: err,
      message: "error when validating otp",
      action: "VALIDATE_OTP",
      shopperId,
      otp,
      shopperPhone,
    });
    return false;
  }
};
