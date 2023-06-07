import { Router } from "express";
import { addToBasketController, getBasketController } from "../controllers/basket";
import { SHOPPER_AUTH_MIDDLEWARE } from "../middleware/jwt";

const route = Router();

route.post("/:companyId", SHOPPER_AUTH_MIDDLEWARE, addToBasketController);
route.get("/:companyId", SHOPPER_AUTH_MIDDLEWARE, getBasketController);

export default route;
