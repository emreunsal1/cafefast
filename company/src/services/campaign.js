import { CAMPAING_ROUTE, MENU_ROUTE } from "@/constants";
import instance from "../utils/axios";

const get = () => instance.get(`${CAMPAING_ROUTE}`);

const create = async (data) => {
  try {
    const response = await instance.post(`${CAMPAING_ROUTE}/`, data);
    return response;
  } catch (error) {
    return false;
  }
};

const update = async (campaignId, data) => {
  try {
    const response = await instance.put(`${CAMPAING_ROUTE}/${campaignId}`, data);
    return response;
  } catch (error) {
    return false;
  }
};

const deleteCampain = async (campaignId) => {
  await instance.delete(`${CAMPAING_ROUTE}/${campaignId}`);
};

const addCampaingToMenu = async (menuID, campainID) => instance.post(`${MENU_ROUTE}/${menuID}/campaign/${campainID}`);

const removeCampaingFromMenu = async (menuID, campainID) => instance.delete(`${MENU_ROUTE}/${menuID}/campaign/${campainID}`);

const CAMPAIGN_SERVICE = {
  get,
  create,
  update,
  deleteCampain,
  addCampaingToMenu,
  removeCampaingFromMenu,
};

export default CAMPAIGN_SERVICE;
