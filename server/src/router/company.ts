import { Router } from "express";
import { getCompanyController } from "../controllers/company";

const router = Router();

router.get("/", getCompanyController);

export default router;
