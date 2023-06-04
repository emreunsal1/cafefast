import { Router } from "express";
import { addToBasketController } from "../controllers/basket";
import { SHOPPER_AUTH_MIDDLEWARE } from "../middleware/jwt";

const route = Router();

route.post("/:companyId", SHOPPER_AUTH_MIDDLEWARE, addToBasketController);

export default route;
