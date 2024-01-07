import { SHOPPER_NOT_FOUND_IN_DATABASE } from "../constants";
import shopperModel from "../models/shopper";

export const createShopper = async (shopperData = {}) => {
  try {
    const newShopper = await shopperModel.create(shopperData);
    return { data: newShopper };
  } catch (error) {
    return { error: (error as any).message || error };
  }
};

export const getShopper = async (shopperId, populate = true) => {
  try {
    const foundShopper = shopperModel.findById(shopperId);
    if (populate) {
      foundShopper.populate("basket.products.product").populate({
        path: "basket.campaigns.campaign",
        populate: {
          path: "products",
          model: "product",
        },
      });
    }

    const result = await foundShopper.exec();
    return { data: result };
  } catch (error) {
    return { error: (error as any).message || error };
  }
};

export const getShopperBasketItems = async (shopperId) => {
  try {
    const foundShopper = await shopperModel.findById(shopperId);
    if (!foundShopper) {
      return { errorCode: SHOPPER_NOT_FOUND_IN_DATABASE };
    }

    const allProducts = foundShopper?.basket?.products.map((_product) => _product.product);
    const allCampaigns = foundShopper?.basket?.campaigns.map((_campaign) => _campaign.campaign);

    return { data: { products: allProducts, campaigns: allCampaigns, companyId: foundShopper?.basket?.company } };
  } catch (error) {
    return { error: (error as any).message || error };
  }
};

export const addProductToShopper = async (shopperId, { productId, selectedAttributes }) => {
  try {
    const newShopper = await shopperModel.findOneAndUpdate(
      { _id: shopperId },
      { $push: { "basket.products": { product: productId, count: 1, selectedAttributes } } },
      { new: true },
    );
    return { data: newShopper };
  } catch (error) {
    return { error: (error as any).message || error };
  }
};

export const addOrderToShopper = async (shopperId, orderId) => {
  try {
    const newShopper = await shopperModel.findOneAndUpdate(
      { _id: shopperId },
      { $push: { orders: orderId } },
      { new: true },
    );
    return { data: newShopper };
  } catch (error) {
    return { error: (error as any).message || error };
  }
};

export const setPhoneNumberToShopper = async (shopperId, phone) => {
  try {
    const newShopper = await shopperModel.findOneAndUpdate(
      { _id: shopperId },
      { phone },
      { new: true },
    );
    return { data: newShopper };
  } catch (error) {
    return { error: (error as any).message || error };
  }
};

export const setLastOtpDateToShopper = async (shopperId) => {
  try {
    const newShopper = await shopperModel.findOneAndUpdate(
      { _id: shopperId },
      { lastOtpDate: Date.now() },
      { new: true },
    );
    return { data: newShopper };
  } catch (error) {
    return { error: (error as any).message || error };
  }
};

export const addCardToShopper = async (shopperId, cardData) => {
  try {
    const newShopper = await shopperModel.findOneAndUpdate(
      { _id: shopperId },
      { $push: { cards: cardData } },
      { new: true },
    );

    if (newShopper?.cards.length) {
      const lastCard = newShopper.cards[newShopper.cards.length - 1];
      return { data: lastCard };
    }

    return { error: "card can not added to shopper" };
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

export const clearShopperBasket = async (shopperId, companyId) => {
  try {
    const newShopper = await shopperModel.findOneAndUpdate(
      { _id: shopperId },
      {
        $set: {
          basket: {
            products: [],
            campaigns: [],
            company: companyId,
          },
        },
      },
      { new: true },
    );

    return { data: newShopper };
  } catch (error) {
    return { error: (error as any).message || error };
  }
};

export const deleteProductFromShopper = async ({ shopperId, productId }) => {
  try {
    const newShopper = await shopperModel.findOneAndUpdate(
      { _id: shopperId },
      {
        $pull: {
          "basket.products": {
            product: productId,
          },
        },
      },
      { new: true },
    );

    if (!newShopper) {
      return { error: "Shopper not found" };
    }
    return { data: newShopper };
  } catch (error) {
    return { error: (error as any).message || error };
  }
};

export const deleteProductsFromShopper = async ({ shopperId, productIds }) => shopperModel.findOneAndUpdate(
  { _id: shopperId },
  {
    $pull: {
      "basket.products": {
        product: {
          $in: productIds,
        },
      },
    },
  },
  { new: true },
);

export const deleteCampaignFromShopper = async ({ shopperId, campaignId }) => {
  try {
    const newShopper = await shopperModel.findOneAndUpdate(
      { _id: shopperId },
      {
        $pull: {
          "basket.campaigns": {
            campaign: campaignId,
          },
        },
      },
      { new: true },
    );

    if (!newShopper) {
      return { error: "Shopper not found" };
    }
    return { data: newShopper };
  } catch (error) {
    return { error: (error as any).message || error };
  }
};
