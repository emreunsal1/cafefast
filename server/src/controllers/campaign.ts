import { Request, Response } from "express";
import { createCampaign } from "../services/campaign";
import { createCampaignVerifier } from "../models/campaign";
import { addCampaignToMenu } from "../services/menu";

export const createCampaignController = async (req: Request, res: Response) => {
  const { menuId } = req.params;
  try {
    const verifiedCampaign = await createCampaignVerifier.parseAsync(req.body);

    const campaignResponse = await createCampaign(verifiedCampaign);
    if (!campaignResponse.data || campaignResponse.error) {
      return res.send(campaignResponse.error);
    }

    const menuResponse = await addCampaignToMenu({ campaignId: campaignResponse.data._id, menuId });
    if (!menuResponse.data || menuResponse.error) {
      return res.send(menuResponse.error);
    }

    res.status(201).send(campaignResponse.data);
  } catch (error) {
    res.status(400).send({
      error,
    });
  }
};
