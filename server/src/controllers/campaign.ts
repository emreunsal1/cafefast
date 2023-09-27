import { Request, Response } from "express";
import { createCampaign, deleteCampaign, updateCampaign } from "../services/campaign";
import { createCampaignVerifier, updateCampaignVerifier } from "../models/campaign";
import { removeCampaignFromMenus } from "../services/menu";
import { addCampaignToCompany, getCompanyCampaigns, removeCampaignFromCompany } from "../services/company";
import { mapCampaigns } from "../utils/mappers";

export const getCompanyCampaignsController = async (req: Request, res: Response, next) => {
  try {
    const { company } = req.user;
    const campaignResponse = await getCompanyCampaigns(company);

    if (!campaignResponse.data || campaignResponse.error) {
      return res.send(campaignResponse.error);
    }

    res.status(200).send(mapCampaigns(campaignResponse.data));
  } catch (error) {
    next(error);
  }
};

export const createCampaignController = async (req: Request, res: Response, next) => {
  try {
    const { company } = req.user;
    const verifiedCampaign = await createCampaignVerifier.parseAsync(req.body);

    const campaignResponse = await createCampaign(verifiedCampaign);
    if (!campaignResponse.data || campaignResponse.error) {
      return res.send(campaignResponse.error);
    }

    const { data: companyData, error: companyError } = await addCampaignToCompany(company, campaignResponse.data._id);
    if (!companyData || companyError) {
      return res.status(400).send(companyError);
    }

    res.status(201).send(campaignResponse.data);
  } catch (error) {
    next(error);
  }
};

export const updateCampaignController = async (req: Request, res: Response, next) => {
  const { campaignId } = req.params;
  try {
    const verifiedCampaign = await updateCampaignVerifier.parseAsync(req.body);

    const campaignResponse = await updateCampaign(campaignId, verifiedCampaign);
    if (!campaignResponse.data || campaignResponse.error) {
      return res.status(400).send(campaignResponse.error);
    }

    res.status(200).send(campaignResponse.data);
  } catch (error) {
    next(error);
  }
};

export const deleteCampaignController = async (req: Request, res: Response, next) => {
  const { campaignId } = req.params;
  try {
    const campaignResponse = await deleteCampaign(campaignId);
    if (!campaignResponse.data || campaignResponse.error) {
      return res.status(400).send({ message: "error when deleting campaign", error: campaignResponse.error });
    }

    const companyResponse = await removeCampaignFromCompany(campaignId);
    if (!companyResponse.data || companyResponse.error) {
      return res.status(400).send({ message: "error when removing campaign from company", error: companyResponse.error });
    }

    const menuResponse = await removeCampaignFromMenus(campaignId);
    if (!menuResponse.data || menuResponse.error) {
      return res.status(400).send({ message: "error when removing campaign from menu", error: menuResponse.error });
    }

    res.status(200).send({ success: campaignResponse.data });
  } catch (error) {
    next(error);
  }
};
