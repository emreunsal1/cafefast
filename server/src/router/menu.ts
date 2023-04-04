import { Router } from "express";
import { AUTH_REQUIRED_MIDDLEWARE } from "../middleware/jwt";
import { ADMIN_PERMISSON_MIDDLEWARE, MENU_EXISTS_MIDDLEWARE } from "../middleware/permission";

import {
  createCategoryController,
  deleteCategoryController,
  updateCategoryController,
} from "../controllers/category";
import {
  createMenuController,
  deleteMenuController,
  getMenuDetailController,
  getMenusController,
  updateMenuController,
} from "../controllers/menu";
import {
  createProductController,
  deleteProductController,
  updateProductController,
} from "../controllers/product";
import {
  createCampaignController,
  deleteCampaignController,
  updateCampaignController,
} from "../controllers/campaign";

const router = Router();

router.get("/", AUTH_REQUIRED_MIDDLEWARE, getMenusController);
router.post("/", AUTH_REQUIRED_MIDDLEWARE, ADMIN_PERMISSON_MIDDLEWARE, createMenuController);
router.get("/:menuId", AUTH_REQUIRED_MIDDLEWARE, ADMIN_PERMISSON_MIDDLEWARE, MENU_EXISTS_MIDDLEWARE, getMenuDetailController);
router.delete("/:menuId", AUTH_REQUIRED_MIDDLEWARE, ADMIN_PERMISSON_MIDDLEWARE, MENU_EXISTS_MIDDLEWARE, deleteMenuController);
router.put("/:menuId", AUTH_REQUIRED_MIDDLEWARE, ADMIN_PERMISSON_MIDDLEWARE, MENU_EXISTS_MIDDLEWARE, updateMenuController);

// Category
router.post("/:menuId/category", AUTH_REQUIRED_MIDDLEWARE, ADMIN_PERMISSON_MIDDLEWARE, MENU_EXISTS_MIDDLEWARE, createCategoryController);
router.put("/:menuId/category/:categoryId", AUTH_REQUIRED_MIDDLEWARE, ADMIN_PERMISSON_MIDDLEWARE, MENU_EXISTS_MIDDLEWARE, updateCategoryController);
router.delete(
  "/:menuId/category/:categoryId",
  AUTH_REQUIRED_MIDDLEWARE,
  ADMIN_PERMISSON_MIDDLEWARE,
  MENU_EXISTS_MIDDLEWARE,
  deleteCategoryController,
);

// Product
router.post(
  "/:menuId/category/:categoryId/product",
  AUTH_REQUIRED_MIDDLEWARE,
  ADMIN_PERMISSON_MIDDLEWARE,
  MENU_EXISTS_MIDDLEWARE,
  createProductController,
);
router.delete(
  "/:menuId/category/:categoryId/product",
  AUTH_REQUIRED_MIDDLEWARE,
  ADMIN_PERMISSON_MIDDLEWARE,
  MENU_EXISTS_MIDDLEWARE,
  deleteProductController,
);
router.put(
  "/:menuId/category/:categoryId/product/:productId",
  AUTH_REQUIRED_MIDDLEWARE,
  ADMIN_PERMISSON_MIDDLEWARE,
  MENU_EXISTS_MIDDLEWARE,
  updateProductController,
);

// Campaign
router.post("/:menuId/campaign", AUTH_REQUIRED_MIDDLEWARE, ADMIN_PERMISSON_MIDDLEWARE, MENU_EXISTS_MIDDLEWARE, createCampaignController);
router.put("/:menuId/campaign/:campaignId", AUTH_REQUIRED_MIDDLEWARE, ADMIN_PERMISSON_MIDDLEWARE, MENU_EXISTS_MIDDLEWARE, updateCampaignController);
router.delete(
  "/:menuId/campaign/:campaignId",
  AUTH_REQUIRED_MIDDLEWARE,
  ADMIN_PERMISSON_MIDDLEWARE,
  MENU_EXISTS_MIDDLEWARE,
  deleteCampaignController,
);

export default router;
