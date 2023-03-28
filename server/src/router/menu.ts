import { Router } from "express";
import { createCategoryController } from "../controllers/category";
import { createMenuController, deleteMenuController, getMenusController } from "../controllers/menu";
import { AUTH_REQUIRED_MIDDLEWARE } from "../middleware/jwt";
import { ADMIN_PERMISSON_MIDDLEWARE } from "../middleware/permission";

const router = Router();

router.get("/", AUTH_REQUIRED_MIDDLEWARE, getMenusController);
router.post("/", AUTH_REQUIRED_MIDDLEWARE, ADMIN_PERMISSON_MIDDLEWARE, createMenuController);
router.delete("/:menuId", AUTH_REQUIRED_MIDDLEWARE, ADMIN_PERMISSON_MIDDLEWARE, deleteMenuController);

router.post("/:menuId/category", AUTH_REQUIRED_MIDDLEWARE, ADMIN_PERMISSON_MIDDLEWARE, createCategoryController);

export default router;
