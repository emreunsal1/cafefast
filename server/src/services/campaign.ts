import campaignModel from "../models/campaign";

export const createCampaign = async (data) => {
  try {
    const result = await campaignModel.create(data);
    return { data: result };
  } catch (error) {
    console.log("[createCampaign] error :>> ", error);
    return { error: (error as any).message || error };
  }
};

export const updateCampaign = async (campaignId, data) => {
  try {
    const result = await campaignModel.findOneAndUpdate({ _id: campaignId }, data, { new: true });
    return { data: result };
  } catch (error) {
    console.log("[updateCampaign] error :>> ", error);
    return { error: (error as any).message || error };
  }
};

export const deleteCampaign = async (campaignId) => {
  try {
    await campaignModel.deleteOne({ _id: campaignId });
    return { data: true };
  } catch (error) {
    console.log("[deleteCampaign] error :>> ", error);
    return { error: (error as any).message || error };
  }
};
