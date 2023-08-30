import { NextFunction, Request, Response } from "express";
import { getCompanyActiveMenu } from "../services/company";
import { getShopper } from "../services/shopper";

export const COMPANY_ACTIVE_MENU_MIDDLEWARE = async (req: Request, res: Response, next: NextFunction) => {
  const { companyId } = req.params;
  const companyActiveMenu = await getCompanyActiveMenu(companyId);

  if (companyActiveMenu.error || !companyActiveMenu.data) {
    return res.status(404).send({
      message: "[COMPANY_ACTIVE_MENU_MIDDLEWARE] Company has no active menu",
    });
  }
  res.locals.companyActiveMenu = companyActiveMenu.data;
  next();
};

export const SHOPPER_DATA_MIDDLEWARE = async (req: Request, res: Response, next: NextFunction) => {
  const { shopper } = req;
  const shopperData = await getShopper(shopper._id, false);

  // TODO: set new cookie to shopper if there is no shopperData in database.
  if (!shopperData.data) {
    return res.status(404).send({
      message: "[SHOPPER_DATA_MIDDLEWARE] Shopper not found",
    });
  }
  res.locals.shopperData = shopperData.data;
  next();
};
