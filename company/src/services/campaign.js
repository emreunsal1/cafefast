import instance from "../utils/axios";

const create = async (menuId, data) => {
  try {
    const response = await instance.post(`/menu/${menuId}/campaign`, data);
    return response;
  } catch (error) {
    console.log("create campaign error", { error });
    return false;
  }
};

const update = async (menuId, campaignId, data) => {
  try {
    const response = await instance.put(`/menu/${menuId}/campaign/${campaignId}`, data);
    return response;
  } catch (error) {
    console.log("create campaign error", { error });
    return false;
  }
};

const CAMPAIGN_SERVICE = {
  create,
  update,
};

export default CAMPAIGN_SERVICE;
