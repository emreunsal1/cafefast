import { NextFunction, Request, Response } from "express";
import { AUTH_TOKEN_COOKIE_NAME, SHOPPER_AUTH_TOKEN_NAME } from "../constants";
import { IUserWithoutPassword } from "../models/user";
import { getUser } from "../services/user";
import { generateJwt, verifyJwt } from "../utils/jwt";
import { mapShopperForJWT, mapUserForJWT } from "../utils/mappers";
import { createBasketObject } from "../utils/basket";
import { clearShopperBasket, createShopper } from "../services/shopper";

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

export const SHOPPER_RESOLVE_MIDDLEWARE = async (req: Request, res: Response, next: NextFunction) => {
  const authToken = req.cookies[SHOPPER_AUTH_TOKEN_NAME];
  if (!authToken) {
    return next();
  }

  const data = verifyJwt(authToken);
  if (!data) {
    res.status(401).send("Unauthorized");
    return;
  }

  req.shopper = data;
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
    res.cookie(SHOPPER_AUTH_TOKEN_NAME, newShopperJWT, { httpOnly: !!process.env.ENVIRONMENT }).send({ token: newShopperJWT });
  }

  req.shopper = verifiedUser;
  next();
};

export const SHOPPER_COMPANY_CHANGE_MIDDLEWARE = async (req: Request, res: Response, next: NextFunction) => {
  const { shopper } = req;
  const { companyId } = req.params;
  const { shopperData } = res.locals;

  if (companyId !== shopperData.basket.companyId) {
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
