import { ROUTES } from "../../constants";

const { default: instance } = require("../../utils/axios");

const approveBasket = async (data) => {
  try {
    await instance.post(`${ROUTES.BASKET}/${data.companyId}/approve`, data);
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

const addProductToBasket = async ({ companyId, productId, attributes = [] }) => {
  try {
    return instance.post(`${ROUTES.BASKET}/${companyId}/product`, {
      productId,
      attributes,
    });
  } catch (error) {
    return false;
  }
};

const getBasket = async ({ companyId }) => {
  try {
    const response = await instance.get(`${ROUTES.BASKET}/${companyId}`);
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

const getSavedCards = () => instance.get(`${ROUTES.BASKET}/saved-cards`);

const BASKET_SERVICE = {
  approveBasket,
  addToBasket,
  addProductToBasket,
  getBasket,
  updateItemQuantity,
  deleteProduct,
  deleteCampaign,
  getSavedCards,
};

export default BASKET_SERVICE;
