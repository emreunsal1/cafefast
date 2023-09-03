import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { Response } from "express";
import { IUserWithoutPassword } from "../models/user";
import { ONE_YEAR_AS_MS } from "../constants";

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

export const setCookie = (res: Response, cookieName: string, cookieValue: string, options = {
  maxAge: ONE_YEAR_AS_MS,
}) => {
  res.cookie(cookieName, cookieValue, { httpOnly: !!process.env.ENVIRONMENT, maxAge: options.maxAge });
};
