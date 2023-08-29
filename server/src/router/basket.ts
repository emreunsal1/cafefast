import { Router } from "express";
import {
  addToBasketController,
  getBasketController,
  updateQuantityController,
  deleteProductInBasketController,
  deleteCampaignInBasketController,
  approveBasketController,
  getShopperSavedCardController,
} from "../controllers/basket";
import {
  SHOPPER_RESOLVE_MIDDLEWARE,
  SHOPPER_AUTH_REQUIRED_MIDDLEWARE,
} from "../middleware/jwt";

const route = Router();

route.get("/saved-cards", SHOPPER_AUTH_REQUIRED_MIDDLEWARE, getShopperSavedCardController);
route.get("/:companyId", SHOPPER_AUTH_REQUIRED_MIDDLEWARE, getBasketController);
route.post("/:companyId", SHOPPER_RESOLVE_MIDDLEWARE, addToBasketController);
route.put("/:companyId/quantity", SHOPPER_AUTH_REQUIRED_MIDDLEWARE, updateQuantityController);
route.delete("/:companyId/product/:productId", SHOPPER_AUTH_REQUIRED_MIDDLEWARE, deleteProductInBasketController);
route.delete("/:companyId/campaign/:campaignId", SHOPPER_AUTH_REQUIRED_MIDDLEWARE, deleteCampaignInBasketController);
route.post("/:companyId/approve", SHOPPER_AUTH_REQUIRED_MIDDLEWARE, approveBasketController);

export default route;
