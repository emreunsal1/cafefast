import { NextFunction, Request, Response } from "express";
import { checkCompanyHasMenu } from "../services/company";
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

export const MENU_EXISTS_MIDDLEWARE = async (req: Request, res: Response, next: NextFunction) => {
  const { menuId, categoryId } = req.params;
  const { company } = req.user;
  const isExists = await checkCompanyHasMenu(menuId, company, categoryId);

  if (!isExists) {
    return res.status(404).send({
      message: "[MENU_EXISTS_MIDDLEWARE] not allowed for this request",
    });
  }
  next();
};
