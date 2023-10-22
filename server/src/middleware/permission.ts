import { NextFunction, Request, Response } from "express";
import { getCompany } from "../services/company";
import { getUser } from "../services/user";

export const ADMIN_PERMISSON_MIDDLEWARE = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.user;
  const { data } = await getUser({ query: { email } });

  if (data?.role !== 0) {
    return res.status(401).send({
      message: "[ADMIN_PERMISSON_MIDDLEWARE] not allowed for this request",
    });
  }
  next();
};

export const COMPANY_MIDDLEWARE = async (req: Request, res: Response, next: NextFunction) => {
  const { company } = req.user;
  const { data: foundCompany } = await getCompany({
    query: {
      _id: company,
    },
    populate: false,
  });

  if (!foundCompany) return res.status(404).send({ message: "[COMPANY_MIDDLEWARE] error when getting company info" });

  res.locals.companyInfo = foundCompany;
  next();
};
