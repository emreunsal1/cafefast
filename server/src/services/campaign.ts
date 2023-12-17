import campaignModel from "../models/campaign";

export const getCampaign = async (campaignId) => campaignModel.findOne({ _id: campaignId }).populate("products");

export const createCampaign = async (data) => {
  try {
    const result = await campaignModel.create(data);
    return { data: result };
  } catch (error) {
    return { error: (error as any).message || error };
  }
};

export const updateCampaign = async (campaignId, data) => {
  try {
    const result = await campaignModel.findOneAndUpdate({ _id: campaignId }, data, { new: true });
    return { data: result };
  } catch (error) {
    return { error: (error as any).message || error };
  }
};

export const deleteCampaign = async (campaignId) => {
  try {
    const deleteCampaignResult = await campaignModel.deleteOne({ _id: campaignId });
    return { data: deleteCampaignResult.deletedCount > 0 };
  } catch (error) {
    return { error: (error as any).message || error };
  }
};

export const deleteMultipleCampaign = async (campaignIds) => campaignModel.deleteOne({ _id: { $in: campaignIds } });
