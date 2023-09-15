import { HOUR_AS_MS } from "../constants";
import { getRedis } from "../services/redis";
import logger from "./logger";

export const checkOtpIsValid = async ({
  shopperId, shopperPhone, shopperLastOtpDate, otp,
}) => {
  try {
    const isOtpRequired = !shopperLastOtpDate || (Date.now() - shopperLastOtpDate) > (12 * HOUR_AS_MS);
    if (!isOtpRequired) {
      return true;
    }

    const redis = getRedis();
    const foundOtpOnRedis = await redis.get(`${shopperId}-${shopperPhone}`);
    return foundOtpOnRedis === otp;
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
