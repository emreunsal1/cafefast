import instance from "../../utils/axios";

const needOtp = async () => {
  const response = instance.get("basket/need-otp");
  return (await response).data;
};

const sendOtp = async (data) => {
  const response = await instance.post(
    "basket/otp",
    data,
  );
  return response.data;
};

export const OTP_SERVICE = {
  needOtp,
  sendOtp,
};
