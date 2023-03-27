import { NextFunction, Request, Response } from "express";
import { getUser } from "../services/user";

export const ADMIN_PERMISSON_MIDDLEWARE = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.user;
  const { data } = await getUser({ query: { email } });

  if (data?.role !== 0) {
    return res.status(401).send({
      message: "You not allowed for this request",
    });
  }
  next();
};
