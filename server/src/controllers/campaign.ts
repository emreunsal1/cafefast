import { Request, Response } from "express";
import { createCampaign, deleteCampaign, updateCampaign } from "../services/campaign";
import { createCampaignVerifier, updateCampaignVerifier } from "../models/campaign";
import { removeCampaignFromMenu } from "../services/menu";
import { addCampaignToCompany, getCompanyCampaigns } from "../services/company";

export const getCompanyCampaignsController = async (req: Request, res: Response) => {
  try {
    const { company } = req.user;
    const campaignResponse = await getCompanyCampaigns(company);

    if (!campaignResponse.data || campaignResponse.error) {
      return res.send(campaignResponse.error);
    }

    res.status(200).send(campaignResponse.data);
  } catch (error) {
    res.status(400).send({
      error,
    });
  }
};

export const createCampaignController = async (req: Request, res: Response) => {
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
