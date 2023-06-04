import shopperModel from "../models/shopper";

export const createShopper = async (shopperData) => {
  try {
    const newShopper = await shopperModel.create(shopperData);
    return { data: newShopper };
  } catch (error) {
    return { error: (error as any).message || error };
  }
};

export const addProductToShopper = async (shopperId, productId) => {
  try {
    const newShopper = await shopperModel.findOneAndUpdate(
      { _id: shopperId },
      { $push: { "basket.products": productId } },
      { new: true },
    );
    return { data: newShopper };
  } catch (error) {
    return { error: (error as any).message || error };
  }
};

export const addCampaignToShopper = async (shopperId, campaignId) => {
  try {
    const newShopper = await shopperModel.findOneAndUpdate(
      { _id: shopperId },
      { $push: { "basket.campaigns": campaignId } },
      { new: true },
    );
    return { data: newShopper };
  } catch (error) {
    return { error: (error as any).message || error };
  }
};
