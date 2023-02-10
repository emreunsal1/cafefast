import { NextFunction, Request, Response } from "express";
import { AUTH_TOKEN_COOKIE_NAME } from "../constants";
import { IUserWithoutPassword } from "../models/user";
import { verifyJwt } from "../utils/jwt";

export const AUTH_REQUIRED_MIDDLEWARE = async (req: Request, res: Response, next: NextFunction) => {
  const authToken = req.cookies[AUTH_TOKEN_COOKIE_NAME];
  if (!authToken) {
    res.status(401).send("Unauthorized");
    return;
  }
  const data = verifyJwt(authToken);
  if (!data) {
    res.status(401).send("Unauthorized");
    return;
  }
  req.user = data as IUserWithoutPassword;
  next();
};
