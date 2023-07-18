import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { IUserWithoutPassword } from "../models/user";

dotenv.config();
const secretKey = process.env.JWT_SECRET_KEY as string;

export const generateJwt = async (user) => {
  try {
    const generatedJWT = await jwt.sign(user, secretKey, {
      expiresIn: "7d",
    });
    return generatedJWT;
  } catch (error: Error | unknown) {
    console.log("[generateJwt] => ", error);
    return false;
  }
};

export const verifyJwt = (token: string): IUserWithoutPassword | false => {
  try {
    const payload = jwt.verify(token, secretKey);
    if (!payload) {
      console.log("[verifyJwt] verify error", payload);
      return false;
    }
    return payload as IUserWithoutPassword;
  } catch (err) {
    console.log("[verifyJwt]", err);
    return false;
  }
};
