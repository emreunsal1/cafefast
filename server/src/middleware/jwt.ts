import { NextFunction, Request, Response } from "express";
import { AUTH_TOKEN_COOKIE_NAME } from "../constants";
import { IUserWithoutPassword } from "../models/user";
import { getUser } from "../services/user";
import { generateJwt, verifyJwt } from "../utils/jwt";
import { mapUserForJWT } from "../utils/mappers";

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

  if (!data.company) {
    const { data: userData } = await getUser({ query: { email: data.email } });
    const createdJWT = await generateJwt(mapUserForJWT(userData));
    res.cookie(
      AUTH_TOKEN_COOKIE_NAME,
      createdJWT,
      { httpOnly: !!process.env.ENVIRONMENT },
    );
  }
  req.user = data as IUserWithoutPassword;
  next();
};
