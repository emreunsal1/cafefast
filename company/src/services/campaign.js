import { CAMPAING_ROUTE } from "@/constants";
import instance from "../utils/axios";

const get = () => instance.get(`${CAMPAING_ROUTE}`);

const create = async (data) => {
  try {
    const response = await instance.post(`${CAMPAING_ROUTE}/`, data);
    return response;
  } catch (error) {
    console.log("create campaign error", { error });
    return false;
  }
};

const update = async (campaignId, data) => {
  console.log("update data id data", { campaignId, data });
  try {
    const response = await instance.put(`${CAMPAING_ROUTE}/${campaignId}`, data);
    return response;
  } catch (error) {
    console.log("create campaign error", { error });
    return false;
  }
};

const deleteCampain = async (campaignId) => {
  await instance.delete(`${CAMPAING_ROUTE}/${campaignId}`);
};

const CAMPAIGN_SERVICE = {
  get,
  create,
  update,
  deleteCampain,
};

export default CAMPAIGN_SERVICE;
