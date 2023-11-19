import { jwtVerify } from "jose";

export const verifyJWT = async (authToken) => {
  try {
    const secretKeyUint8 = new TextEncoder().encode(process.env.JWT_SECRET_KEY);
    const verifiedToken = await jwtVerify(authToken, secretKeyUint8);
    return verifiedToken;
  } catch (err) {
    return false;
  }
};
