import { ROUTES } from "../../constants";

const { default: instance } = require("../../utils/axios");

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
    return response;
  } catch (error) {
    return false;
  }
};

const BASKET_SERVICE = {
  addToBasket,
  getBasket,
};

export default BASKET_SERVICE;
