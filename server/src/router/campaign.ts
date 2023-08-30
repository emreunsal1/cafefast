import { Router } from "express";
import {
  ADMIN_PERMISSON_MIDDLEWARE, BODY_PRODUCT_EXISTS_MIDDLEWARE, COMPANY_MIDDLEWARE, REQUEST_PARAMS_CAMPAIGN_EXISTS_MIDDLEWARE,
} from "../middleware/permission";
import {
  createCampaignController, deleteCampaignController, getCompanyCampaignsController, updateCampaignController,
} from "../controllers/campaign";

const router = Router();

router.get(
  "/",
  ADMIN_PERMISSON_MIDDLEWARE,
  getCompanyCampaignsController,
);
router.post(
  "/",
  ADMIN_PERMISSON_MIDDLEWARE,
  COMPANY_MIDDLEWARE,
  BODY_PRODUCT_EXISTS_MIDDLEWARE,
  createCampaignController,
);
router.put(
  "/:campaignId",
  ADMIN_PERMISSON_MIDDLEWARE,
  COMPANY_MIDDLEWARE,
  BODY_PRODUCT_EXISTS_MIDDLEWARE,
  REQUEST_PARAMS_CAMPAIGN_EXISTS_MIDDLEWARE,
  updateCampaignController,
);
router.delete(
  "/:campaignId",
  ADMIN_PERMISSON_MIDDLEWARE,
  COMPANY_MIDDLEWARE,
  REQUEST_PARAMS_CAMPAIGN_EXISTS_MIDDLEWARE,
  deleteCampaignController,
);

export default router;
