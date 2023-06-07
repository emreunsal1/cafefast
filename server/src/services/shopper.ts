import shopperModel from "../models/shopper";

export const createShopper = async (shopperData) => {
  try {
    const newShopper = await shopperModel.create(shopperData);
    return { data: newShopper };
  } catch (error) {
    return { error: (error as any).message || error };
  }
};

export const getShopper = async (shopperId) => {
  try {
    const foundShopper = await shopperModel.findById(shopperId).populate("basket.products.product").populate("basket.campaigns.campaign");
    return { data: foundShopper };
  } catch (error) {
    return { error: (error as any).message || error };
  }
};

export const getShopperBasketItems = async (shopperId) => {
  try {
    const foundShopper = await shopperModel.findById(shopperId);
    const allProducts = foundShopper?.basket?.products.map((_product) => _product.product);
    const allCampaigns = foundShopper?.basket?.campaigns.map((_campaign) => _campaign.campaign);

    return { data: { products: allProducts, campaigns: allCampaigns } };
  } catch (error) {
    return { error: (error as any).message || error };
  }
};

export const addProductToShopper = async (shopperId, productId) => {
  try {
    const newShopper = await shopperModel.findOneAndUpdate(
      { _id: shopperId },
      { $push: { "basket.products": { product: productId, count: 1 } } },
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
      { $push: { "basket.campaigns": { campaign: campaignId, count: 1 } } },
      { new: true },
    );
    return { data: newShopper };
  } catch (error) {
    return { error: (error as any).message || error };
  }
};

export const updateProductCount = async ({ shopperId, productId, quantity }) => {
  try {
    const newShopper = await shopperModel.findOneAndUpdate(
      { _id: shopperId, "basket.products.product": productId },
      {
        $set: {
          "basket.products.$.count": quantity,
        },
      },
      { new: true },
    );

    return { data: newShopper };
  } catch (error) {
    return { error: (error as any).message || error };
  }
};

export const updateCampaignCount = async ({ shopperId, campaignId, quantity }) => {
  try {
    const newShopper = await shopperModel.findOneAndUpdate(
      { _id: shopperId, "basket.campaigns.campaign": campaignId },
      {
        $set: {
          "basket.campaigns.$.count": quantity,
        },
      },
      { new: true },
    );

    return { data: newShopper };
  } catch (error) {
    return { error: (error as any).message || error };
  }
};
