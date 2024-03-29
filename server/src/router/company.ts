import { Router } from "express";
import {
  updateCompanyDesksController,
  clearCompanyDesksController,
  getCompanyController, getCompanyDesksController,
  getCompanyOrdersController,
  updateCompanyController,
  updateCompanyOrderController,
  getOrderDetailController,
} from "../controllers/company";
import { ADMIN_PERMISSON_MIDDLEWARE } from "../middleware/permission";

const router = Router();

router.get("/", getCompanyController);
router.put("/", ADMIN_PERMISSON_MIDDLEWARE, updateCompanyController);

router.get("/orders", getCompanyOrdersController);
router.get("/orders/:orderId", getOrderDetailController);
router.put("/orders/:orderId", updateCompanyOrderController);

router.get("/desks", getCompanyDesksController);
router.put("/desks", updateCompanyDesksController);
router.delete("/desks", clearCompanyDesksController);

export default router;
