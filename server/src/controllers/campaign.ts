import { Request, Response } from "express";
import { createCampaign, deleteCampaign, updateCampaign } from "../services/campaign";
import { createCampaignVerifier, updateCampaignVerifier } from "../models/campaign";
import { addCampaignToMenu, removeCampaignFromMenu } from "../services/menu";

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
      return res.status(400).send(menuResponse.error);
    }

    res.status(201).send(campaignResponse.data);
  } catch (error) {
    res.status(400).send({
      error,
    });
  }
};

export const updateCampaignController = async (req: Request, res: Response) => {
  const { campaignId } = req.params;
  try {
    const verifiedCampaign = await updateCampaignVerifier.parseAsync(req.body);

    const campaignResponse = await updateCampaign(campaignId, verifiedCampaign);
    if (!campaignResponse.data || campaignResponse.error) {
      return res.status(400).send(campaignResponse.error);
    }

    res.status(200).send(campaignResponse.data);
  } catch (error) {
    res.status(400).send({
      error,
    });
  }
};

export const deleteCampaignController = async (req: Request, res: Response) => {
  const { campaignId } = req.params;
  try {
    const campaignResponse = await deleteCampaign(campaignId);
    if (!campaignResponse.data || campaignResponse.error) {
      return res.status(400).send(campaignResponse.error);
    }

    const menuResponse = await removeCampaignFromMenu(campaignId);
    if (!menuResponse.data || menuResponse.error) {
      return res.status(400).send(menuResponse.error);
    }

    res.status(200).send(campaignResponse.data);
  } catch (error) {
    res.status(400).send({
      error,
    });
  }
};
