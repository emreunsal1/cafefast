import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { CookieOptions, Response } from "express";
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

export const createPasswordHash = async (password: string) => {
  const saltRounds = 8;
  return bcrypt.hashSync(password, saltRounds);
};

export const verifyPasswordHash = async (inputPassword, userHashedPassword) => bcrypt.compare(inputPassword, userHashedPassword);

export const setCookie = (res: Response, cookieName: string, cookieValue: string, options = {
  maxAge: ONE_YEAR_AS_MS,
}) => {
  const isProduction = process.env.NODE_ENV === "production";

  const cookieOptions: CookieOptions = {
    maxAge: options.maxAge,
  };

  if (isProduction) {
    // cookieOptions.httpOnly = true;
    cookieOptions.sameSite = "none";
    cookieOptions.secure = false;
  }
  res.cookie(cookieName, cookieValue, cookieOptions);
};
