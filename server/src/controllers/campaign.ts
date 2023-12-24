import { Request, Response } from "express";
import {
  createCampaign, deleteCampaign, deleteMultipleCampaign, getCampaign, updateCampaign,
} from "../services/campaign";
import { createCampaignVerifier, updateCampaignVerifier } from "../models/campaign";
import { removeMultipleCampaignFromMenus } from "../services/menu";
import {
  addCampaignToCompany, getCompanyCampaigns, removeCampaignsFromCompany,
} from "../services/company";
import { mapCampaign, mapCampaigns } from "../utils/mappers";

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

export const getCampaignDetailController = async (req:Request, res:Response, next) => {
  const { campaignId } = req.params;
  const response = await getCampaign(campaignId);
  res.send(mapCampaign(response?.toObject()));
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
    console.log("verified", verifiedCampaign);

    const campaignResponse = await updateCampaign(campaignId, verifiedCampaign);
    if (!campaignResponse.data || campaignResponse.error) {
      return res.status(400).send(campaignResponse.error);
    }
    console.log("campaignResponse.data.toObject()", campaignResponse.data.toObject());
    res.status(200).send(mapCampaign(campaignResponse.data.toObject()));
  } catch (error) {
    next(error);
  }
};

export const deleteCampaignController = async (req: Request, res: Response, next) => {
  const { company } = req.user;
  const { campaignId } = req.params;
  const { campaigns } = req.body;

  try {
    if (campaigns) {
      if (campaigns?.length && campaignId && campaignId !== "multiple") {
        return res.status(400).send({
          message: "you can not send campaigns and campaignId same time",
        });
      }
    }

    if (campaigns && campaignId === "multiple") {
      await deleteMultipleCampaign(campaigns);
    } else {
      const campaignResponse = await deleteCampaign(campaignId);
      if (!campaignResponse.data || campaignResponse.error) {
        return res.status(400).send({ message: "error when deleting campaign", error: campaignResponse.error });
      }
    }
    if (campaigns) {
      const campaingsToDelete = campaigns.length ? campaigns : [campaignId];
      await removeCampaignsFromCompany(company, campaingsToDelete);
      await removeMultipleCampaignFromMenus(campaingsToDelete);
    }

    res.status(200).send({ success: true });
  } catch (error) {
    next(error);
  }
};
