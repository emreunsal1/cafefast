import { Router } from "express";
import { createCategoryController, deleteCategoryController } from "../controllers/category";
import {
  createMenuController, deleteMenuController, getMenusController, updateMenuController,
} from "../controllers/menu";
import { AUTH_REQUIRED_MIDDLEWARE } from "../middleware/jwt";
import { ADMIN_PERMISSON_MIDDLEWARE } from "../middleware/permission";

const router = Router();

router.get("/", AUTH_REQUIRED_MIDDLEWARE, getMenusController);
router.post("/", AUTH_REQUIRED_MIDDLEWARE, ADMIN_PERMISSON_MIDDLEWARE, createMenuController);
router.delete("/:menuId", AUTH_REQUIRED_MIDDLEWARE, ADMIN_PERMISSON_MIDDLEWARE, deleteMenuController);
router.put("/:menuId", AUTH_REQUIRED_MIDDLEWARE, ADMIN_PERMISSON_MIDDLEWARE, updateMenuController);

router.post("/:menuId/category", AUTH_REQUIRED_MIDDLEWARE, ADMIN_PERMISSON_MIDDLEWARE, createCategoryController);
router.delete("/:menuId/category/:categoryId", AUTH_REQUIRED_MIDDLEWARE, ADMIN_PERMISSON_MIDDLEWARE, deleteCategoryController);

export default router;
