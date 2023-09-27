import { PRODUCT_ROUTE } from "../constants";
import instance from "../utils/axios";

const create = async (data) => {
  try {
    const response = await instance.post(PRODUCT_ROUTE, data);
    return response;
  } catch (error) {
    return false;
  }
};

const get = async () => {
  try {
    const response = await instance.get(PRODUCT_ROUTE);
    return response.data;
  } catch (error) {
    return false;
  }
};

const update = async (data) => {
  try {
    const response = await instance.put(`${PRODUCT_ROUTE}/${data._id}`, data);
    return response.data;
  } catch (error) {
    return false;
  }
};

const deleteProduct = async (id) => {
  try {
    const response = await instance.delete(`${PRODUCT_ROUTE}/${id}`);
    return response.data;
  } catch (error) {
    return false;
  }
};

const PRODUCT_SERVICE = {
  create,
  get,
  update,
  deleteProduct,
};

export default PRODUCT_SERVICE;
