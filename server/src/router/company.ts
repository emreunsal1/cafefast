import { Router } from "express";
import { getActiveMenuController, getCompanyController, updateCompanyController } from "../controllers/company";
import { ADMIN_PERMISSON_MIDDLEWARE } from "../middleware/permission";
import { AUTH_REQUIRED_MIDDLEWARE } from "../middleware/jwt";

const router = Router();

router.get("/", AUTH_REQUIRED_MIDDLEWARE, getCompanyController);
router.put("/", AUTH_REQUIRED_MIDDLEWARE, ADMIN_PERMISSON_MIDDLEWARE, updateCompanyController);
router.get("/:companyId/active-menu", getActiveMenuController);

export default router;
