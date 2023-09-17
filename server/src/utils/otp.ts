import { OTP_EXPIRE_IN_SECONDS, OTP_REQUIRED_TIMEOUT_AS_MS } from "../constants";
import { getRedis } from "../services/redis";
import logger from "./logger";

export const getOTPRedisKey = (shopperId, shopperPhone) => `${shopperId}-${shopperPhone}`;

export const checkUserNeedOtp = (shopperLastOtpDate) => {
  const isOtpRequired = !shopperLastOtpDate || (Date.now() - shopperLastOtpDate) > OTP_REQUIRED_TIMEOUT_AS_MS;
  return isOtpRequired;
};

export const setOTPToPhone = async (shopperId, shopperPhone) => {
  // TODO: Create random OTP for user here
  const randomOtpValue = "00000";
  const redis = getRedis();
  const redisKey = getOTPRedisKey(shopperId, shopperPhone);
  await redis.set(redisKey, randomOtpValue);
  await redis.expire(redisKey, OTP_EXPIRE_IN_SECONDS);
};

export const checkOtpIsValid = async ({
  shopperId, shopperPhone, shopperLastOtpDate, otp,
}) => {
  try {
    const isOtpRequired = checkUserNeedOtp(shopperLastOtpDate);
    if (!isOtpRequired) {
      return true;
    }

    const redis = getRedis();
    const foundOtpOnRedis = await redis.get(getOTPRedisKey(shopperId, shopperPhone));
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
