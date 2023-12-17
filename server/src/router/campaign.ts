import { Router } from "express";
import {
  ADMIN_PERMISSON_MIDDLEWARE,
  COMPANY_MIDDLEWARE,
} from "../middleware/permission";
import {
  createCampaignController,
  deleteCampaignController,
  getCampaignDetailController,
  getCompanyCampaignsController,
  updateCampaignController,
} from "../controllers/campaign";
import { CAMPAIGN_EXISTS_IN_COMPANY_MIDDLEWARE, PRODUCT_EXISTS_IN_COMPANY_MIDDLEWARE } from "../middleware/menu";

const router = Router();

router.get(
  "/",
  ADMIN_PERMISSON_MIDDLEWARE,
  getCompanyCampaignsController,
);
router.get(
  "/:campaignId",
  ADMIN_PERMISSON_MIDDLEWARE,
  COMPANY_MIDDLEWARE,
  CAMPAIGN_EXISTS_IN_COMPANY_MIDDLEWARE,
  getCampaignDetailController,
);

router.post(
  "/",
  ADMIN_PERMISSON_MIDDLEWARE,
  COMPANY_MIDDLEWARE,
  PRODUCT_EXISTS_IN_COMPANY_MIDDLEWARE,
  createCampaignController,
);

router.put(
  "/:campaignId",
  ADMIN_PERMISSON_MIDDLEWARE,
  COMPANY_MIDDLEWARE,
  PRODUCT_EXISTS_IN_COMPANY_MIDDLEWARE,
  CAMPAIGN_EXISTS_IN_COMPANY_MIDDLEWARE,
  updateCampaignController,
);
router.delete(
  "/:campaignId",
  ADMIN_PERMISSON_MIDDLEWARE,
  COMPANY_MIDDLEWARE,
  CAMPAIGN_EXISTS_IN_COMPANY_MIDDLEWARE,
  deleteCampaignController,
);

export default router;
