import { NextFunction, Request, Response } from "express";
import { AUTH_TOKEN_COOKIE_NAME, SHOPPER_AUTH_TOKEN_NAME } from "../constants";
import { IUserWithoutPassword } from "../models/user";
import { getUser } from "../services/user";
import { generateJwt, setCookie, verifyJwt } from "../utils/jwt";
import { mapShopperForJWT, mapUserForJWT } from "../utils/mappers";
import { createBasketObject } from "../utils/basket";
import { clearShopperBasket, createShopper } from "../services/shopper";
import logger from "../utils/logger";

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
    setCookie(
      res,
      AUTH_TOKEN_COOKIE_NAME,
      createdJWT as string,
    );
  }
  req.user = data as IUserWithoutPassword;
  next();
};

export const SHOPPER_RESOLVE_OR_CREATE_MIDDLEWARE = async (req: Request, res: Response, next: NextFunction) => {
  const { companyId } = req.params;
  const authToken = req.cookies[SHOPPER_AUTH_TOKEN_NAME];

  let verifiedUser;
  if (authToken) {
    const verifyResult = verifyJwt(authToken);
    if (verifyResult) {
      verifiedUser = verifyResult;
    }
  }

  if (!verifiedUser) {
    const newBasketObject = createBasketObject({ companyId });
    const newShopper = await createShopper({
      basket: newBasketObject,
    });
    verifiedUser = newShopper.data;
    const newShopperJWT = await generateJwt(mapShopperForJWT(verifiedUser));
    setCookie(res, SHOPPER_AUTH_TOKEN_NAME, newShopperJWT as string);
    logger.error({
      action: "SHOPPER_DATA_MIDDLEWARE_CREATE_USER",
      messsage: "user not found new user created",
      newUser: (verifiedUser as any)?._id,
    });
    res.set("x-shopper-resolve-or-create", "true");
  }

  req.shopper = verifiedUser;
  next();
};

export const SHOPPER_COMPANY_CHANGE_MIDDLEWARE = async (req: Request, res: Response, next: NextFunction) => {
  const { shopper } = req;
  const { companyId } = req.params;
  const { shopperData } = res.locals;

  if (companyId !== shopperData.basket.company) {
    const { error: clearShopperError } = await clearShopperBasket(shopper._id, companyId);
    if (clearShopperError) {
      return res.status(500).send({
        message: "something wrong when clear shopper basket",
        stack: clearShopperError,
      });
    }
  }

  next();
};

export const SHOPPER_AUTH_REQUIRED_MIDDLEWARE = async (req: Request, res: Response, next: NextFunction) => {
  const authToken = req.cookies[SHOPPER_AUTH_TOKEN_NAME];
  if (!authToken) {
    res.status(401).send("Unauthorized");
    return;
  }

  const data = verifyJwt(authToken);
  if (!data) {
    res.status(401).send("Unauthorized");
    return;
  }

  req.shopper = data;
  next();
};
