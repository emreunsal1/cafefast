import { Router } from "express";
import {
  addToBasketController, getBasketController, updateQuantityController, deleteProductInBasket,
} from "../controllers/basket";
import { SHOPPER_AUTH_MIDDLEWARE } from "../middleware/jwt";

const route = Router();

route.post("/:companyId", SHOPPER_AUTH_MIDDLEWARE, addToBasketController);
route.get("/:companyId", SHOPPER_AUTH_MIDDLEWARE, getBasketController);
route.put("/:companyId/quantity", SHOPPER_AUTH_MIDDLEWARE, updateQuantityController);
route.delete("/:companyId", SHOPPER_AUTH_MIDDLEWARE, deleteProductInBasket);

export default route;
