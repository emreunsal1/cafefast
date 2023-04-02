import { Router } from "express";
import { createCategoryController, deleteCategoryController, updateCategoryController } from "../controllers/category";
import {
  createMenuController, deleteMenuController, getMenusController, updateMenuController,
} from "../controllers/menu";
import { createProductController } from "../controllers/product";
import { AUTH_REQUIRED_MIDDLEWARE } from "../middleware/jwt";
import { ADMIN_PERMISSON_MIDDLEWARE, MENU_EXISTS_MIDDLEWARE } from "../middleware/permission";

const router = Router();

router.get("/", AUTH_REQUIRED_MIDDLEWARE, getMenusController);
router.post("/", AUTH_REQUIRED_MIDDLEWARE, ADMIN_PERMISSON_MIDDLEWARE, createMenuController);
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
router.put(
  "/:menuId/category/:categoryId/product/:productId",
  AUTH_REQUIRED_MIDDLEWARE,
  ADMIN_PERMISSON_MIDDLEWARE,
  MENU_EXISTS_MIDDLEWARE,
  createProductController,
);

export default router;
