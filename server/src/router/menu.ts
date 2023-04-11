import { Router } from "express";
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
router.post("/:menuId/campaign", ADMIN_PERMISSON_MIDDLEWARE, MENU_EXISTS_MIDDLEWARE, createCampaignController);
router.put("/:menuId/campaign/:campaignId", ADMIN_PERMISSON_MIDDLEWARE, MENU_EXISTS_MIDDLEWARE, updateCampaignController);
router.delete("/:menuId/campaign/:campaignId", ADMIN_PERMISSON_MIDDLEWARE, MENU_EXISTS_MIDDLEWARE, deleteCampaignController);

export default router;
