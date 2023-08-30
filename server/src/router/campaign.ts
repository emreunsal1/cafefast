import { Router } from "express";
import { ADMIN_PERMISSON_MIDDLEWARE, MENU_EXISTS_MIDDLEWARE } from "../middleware/permission";
import {
  createCampaignController, deleteCampaignController, getCompanyCampaignsController, updateCampaignController,
} from "../controllers/campaign";

const router = Router();

router.get("/", ADMIN_PERMISSON_MIDDLEWARE, MENU_EXISTS_MIDDLEWARE, getCompanyCampaignsController);
router.post("/", ADMIN_PERMISSON_MIDDLEWARE, MENU_EXISTS_MIDDLEWARE, createCampaignController);
router.put("/:campaignId", ADMIN_PERMISSON_MIDDLEWARE, MENU_EXISTS_MIDDLEWARE, updateCampaignController);
router.delete("/:campaignId", ADMIN_PERMISSON_MIDDLEWARE, MENU_EXISTS_MIDDLEWARE, deleteCampaignController);

export default router;
