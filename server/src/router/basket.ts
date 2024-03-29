import { Router } from "express";
import {
  getBasketController,
  updateQuantityController,
  deleteProductInBasketController,
  deleteCampaignInBasketController,
  approveBasketController,
  getShopperSavedCardController,
  addProductToBasketController,
  addCampaignToBasketController,
  sendOtpController,
  needOtpController,
} from "../controllers/basket";
import {
  SHOPPER_AUTH_REQUIRED_MIDDLEWARE,
  SHOPPER_RESOLVE_OR_CREATE_MIDDLEWARE,
  SHOPPER_COMPANY_CHANGE_MIDDLEWARE,
  SHOPPER_DATA_MIDDLEWARE,
} from "../middleware/jwt";
import { COMPANY_ACTIVE_MENU_MIDDLEWARE } from "../middleware/menu";

const route = Router();

route.get("/saved-cards", SHOPPER_AUTH_REQUIRED_MIDDLEWARE, getShopperSavedCardController);
route.post("/otp", SHOPPER_AUTH_REQUIRED_MIDDLEWARE, SHOPPER_DATA_MIDDLEWARE, sendOtpController);
route.get("/need-otp", SHOPPER_AUTH_REQUIRED_MIDDLEWARE, SHOPPER_DATA_MIDDLEWARE, needOtpController);

route.get(
  "/:companyId",
  SHOPPER_RESOLVE_OR_CREATE_MIDDLEWARE,
  SHOPPER_DATA_MIDDLEWARE,
  SHOPPER_COMPANY_CHANGE_MIDDLEWARE,
  getBasketController,
);

route.post(
  "/:companyId/product",
  COMPANY_ACTIVE_MENU_MIDDLEWARE,
  SHOPPER_RESOLVE_OR_CREATE_MIDDLEWARE,
  SHOPPER_DATA_MIDDLEWARE,
  SHOPPER_COMPANY_CHANGE_MIDDLEWARE,
  addProductToBasketController,
);

route.post(
  "/:companyId/campaign/:campaignId",
  COMPANY_ACTIVE_MENU_MIDDLEWARE,
  SHOPPER_RESOLVE_OR_CREATE_MIDDLEWARE,
  SHOPPER_DATA_MIDDLEWARE,
  SHOPPER_COMPANY_CHANGE_MIDDLEWARE,
  addCampaignToBasketController,
);

route.put("/:companyId/quantity", SHOPPER_AUTH_REQUIRED_MIDDLEWARE, updateQuantityController);
route.delete("/:companyId/product/:productId", SHOPPER_AUTH_REQUIRED_MIDDLEWARE, deleteProductInBasketController);
route.delete("/:companyId/campaign/:campaignId", SHOPPER_AUTH_REQUIRED_MIDDLEWARE, deleteCampaignInBasketController);
route.post("/:companyId/approve", SHOPPER_AUTH_REQUIRED_MIDDLEWARE, approveBasketController);

export default route;
