import { ROUTES } from "../../constants";

const { default: instance } = require("../../utils/axios");

const approveBasket = async ({ companyId, card, price }) => {
  try {
    const response = await instance.post(`${ROUTES.BASKET}/${companyId}/approve`, {
      price,
      card,
    });
    return true;
  } catch (error) {
    return false;
  }
};

const addToBasket = async ({ companyId, productId, campaignId }) => {
  try {
    const response = await instance.post(`${ROUTES.BASKET}/${companyId}`, {
      product: productId,
      campaign: campaignId,
    });
    return response;
  } catch (error) {
    return false;
  }
};

const getBasket = async ({ companyId }) => {
  try {
    const response = await instance.get(`${ROUTES.BASKET}/${companyId}`);
    console.log("get basket -->", response.data);
    return response;
  } catch (error) {
    return false;
  }
};

const updateItemQuantity = async ({
  companyId, productId, campaignId, quantity,
}) => {
  try {
    const response = await instance.put(`${ROUTES.BASKET}/${companyId}/quantity`, {
      campaign: campaignId,
      product: productId,
      quantity,
    });
    return response;
  } catch (error) {
    return false;
  }
};

const deleteProduct = async ({ companyId, productId }) => {
  try {
    await instance.delete(`${ROUTES.BASKET}/${companyId}/product/${productId}`);
    return true;
  } catch (error) {
    return false;
  }
};

const deleteCampaign = async ({ companyId, campaignId }) => {
  try {
    await instance.delete(`${ROUTES.BASKET}/${companyId}/campaign/${campaignId}`);
    return true;
  } catch (error) {
    return false;
  }
};

const BASKET_SERVICE = {
  approveBasket,
  addToBasket,
  getBasket,
  updateItemQuantity,
  deleteProduct,
  deleteCampaign,
};

export default BASKET_SERVICE;
