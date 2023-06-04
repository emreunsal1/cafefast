import { Router } from "express";
import { getCompanyController, updateCompanyController } from "../controllers/company";
import { ADMIN_PERMISSON_MIDDLEWARE } from "../middleware/permission";

const router = Router();

router.get("/", getCompanyController);
router.put("/", ADMIN_PERMISSON_MIDDLEWARE, updateCompanyController);

export default router;
