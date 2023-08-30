import { Router } from "express";
import {
  ADMIN_PERMISSON_MIDDLEWARE, COMPANY_MIDDLEWARE, MENU_EXISTS_MIDDLEWARE, REQUEST_PARAMS_CAMPAIGN_EXISTS_MIDDLEWARE,
} from "../middleware/permission";

import {
  createCategoryController,
  deleteCategoryController,
  updateCategoryController,
} from "../controllers/category";
import {
  addCampaignToMenuController,
  createMenuController,
  deleteMenuController,
  getMenuDetailController,
  getMenusController,
  removeCampaignFromMenuController,
  updateMenuController,
} from "../controllers/menu";

import { addProductToCategoryController, removeProductFromCategoryController } from "../controllers/product";

const router = Router();

router.get("/", getMenusController);
router.post("/", ADMIN_PERMISSON_MIDDLEWARE, createMenuController);
router.get("/:menuId", ADMIN_PERMISSON_MIDDLEWARE, MENU_EXISTS_MIDDLEWARE, getMenuDetailController);
router.delete("/:menuId", ADMIN_PERMISSON_MIDDLEWARE, MENU_EXISTS_MIDDLEWARE, deleteMenuController);
router.put("/:menuId", ADMIN_PERMISSON_MIDDLEWARE, MENU_EXISTS_MIDDLEWARE, updateMenuController);

// Category
router.post("/:menuId/category", ADMIN_PERMISSON_MIDDLEWARE, MENU_EXISTS_MIDDLEWARE, createCategoryController);
router.put("/:menuId/category/:categoryId", ADMIN_PERMISSON_MIDDLEWARE, MENU_EXISTS_MIDDLEWARE, updateCategoryController);
router.delete("/:menuId/category/:categoryId", ADMIN_PERMISSON_MIDDLEWARE, MENU_EXISTS_MIDDLEWARE, deleteCategoryController);

router.post("/:menuId/category/:categoryId/product/:productId", ADMIN_PERMISSON_MIDDLEWARE, MENU_EXISTS_MIDDLEWARE, addProductToCategoryController);

router.delete(
  "/:menuId/category/:categoryId/product/:productId",
  ADMIN_PERMISSON_MIDDLEWARE,
  MENU_EXISTS_MIDDLEWARE,
  removeProductFromCategoryController,
);

// Campaign
router.post(
  "/:menuId/campaign/:campaignId",
  ADMIN_PERMISSON_MIDDLEWARE,
  COMPANY_MIDDLEWARE,
  REQUEST_PARAMS_CAMPAIGN_EXISTS_MIDDLEWARE,
  addCampaignToMenuController,
);
router.delete(
  "/:menuId/campaign/:campaignId",
  ADMIN_PERMISSON_MIDDLEWARE,
  COMPANY_MIDDLEWARE,
  REQUEST_PARAMS_CAMPAIGN_EXISTS_MIDDLEWARE,
  removeCampaignFromMenuController,
);

export default router;
