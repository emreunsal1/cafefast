import { Router } from "express";
import { createMenuController, deleteMenuController, getMenusController } from "../controllers/menu";
import { AUTH_REQUIRED_MIDDLEWARE } from "../middleware/jwt";
import { ADMIN_PERMISSON_MIDDLEWARE } from "../middleware/permission";

const router = Router();

router.get("/", AUTH_REQUIRED_MIDDLEWARE, getMenusController);
router.post("/", AUTH_REQUIRED_MIDDLEWARE, ADMIN_PERMISSON_MIDDLEWARE, createMenuController);
router.delete("/:id", AUTH_REQUIRED_MIDDLEWARE, ADMIN_PERMISSON_MIDDLEWARE, deleteMenuController);

export default router;
