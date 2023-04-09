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
  createCampaignController,
  deleteCampaignController,
  updateCampaignController,
} from "../controllers/campaign";
import { addProductToCategoryController, removeProductFromCategoryController } from "../controllers/product";

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

router.post(
  "/:menuId/category/:categoryId/product/:productId",
  AUTH_REQUIRED_MIDDLEWARE,
  ADMIN_PERMISSON_MIDDLEWARE,
  MENU_EXISTS_MIDDLEWARE,
  addProductToCategoryController,
);

router.delete(
  "/:menuId/category/:categoryId/product/:productId",
  AUTH_REQUIRED_MIDDLEWARE,
  ADMIN_PERMISSON_MIDDLEWARE,
  MENU_EXISTS_MIDDLEWARE,
  removeProductFromCategoryController,
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
