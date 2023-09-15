import { NextFunction, Request, Response } from "express";
import { getCompanyActiveMenu } from "../services/company";
import { createShopper, getShopper } from "../services/shopper";
import { createBasketObject } from "../utils/basket";
import { generateJwt, setCookie } from "../utils/jwt";
import { mapShopperForJWT } from "../utils/mappers";
import { SHOPPER_AUTH_TOKEN_NAME } from "../constants";
import logger from "../utils/logger";

export const COMPANY_ACTIVE_MENU_MIDDLEWARE = async (req: Request, res: Response, next: NextFunction) => {
  const { companyId } = req.params;
  const companyActiveMenu = await getCompanyActiveMenu(companyId, true);

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
  const { companyId } = req.params;
  let shopperData = await getShopper(shopper._id, false);

  if (!shopperData.data) {
    const newBasketObject = createBasketObject({ companyId });
    logger.error({
      action: "SHOPPER_DATA_MIDDLEWARE_CREATE_USER",
      messsage: "user not found new user created",
      oldUser: shopper?._id,
      newUser: (shopperData.data as any)?._id,
    });
    shopperData = await createShopper({
      basket: newBasketObject,
    });
    const newShopperJWT = await generateJwt(mapShopperForJWT(shopperData.data));
    res.set("x-shopper-data-middleware-create", "true");
    setCookie(res, SHOPPER_AUTH_TOKEN_NAME, newShopperJWT as string);
  }

  res.locals.shopperData = shopperData.data;
  next();
};
