import { COMPANY_ROUTE } from "@/constants";
import instance from "../utils/axios";

const update = async (data) => {
  try {
    const response = await instance.put(COMPANY_ROUTE, data);
    return response;
  } catch (error) {
    console.log("update company error", { error });
    return false;
  }
};

const getOrders = async () => {
  const response = await instance.get(`${COMPANY_ROUTE}/orders`);
  return response.data;
};

const getQr = async () => {
  const response = await instance.get(`${COMPANY_ROUTE}/desks`);
  return response.data;
};

const updateQr = async (data) => {
  const response = await instance.put(`${COMPANY_ROUTE}/desks`, { desks: data });
  return response.data;
};

const deleteQr = async () => {
  await instance.put(`${COMPANY_ROUTE}/desks`);
};

const COMPANY_SERVICE = {
  update,
  getOrders,
  getQr,
  updateQr,
  deleteQr,
};

export default COMPANY_SERVICE;
