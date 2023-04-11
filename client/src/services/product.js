import { PRODUCT_ROUTE } from "../constants";
import instance from "../utils/axios";

const create = async (data) => {
  try {
    const {
      name,
      description,
      price,
      image,
    } = data;

    const response = await instance.post(PRODUCT_ROUTE, {
      name,
      description,
      price,
      image,
    });
    return response;
  } catch (error) {
    console.log("create product error", { error });
    return false;
  }
};

const get = async () => {
  try {
    const response = await instance.get(PRODUCT_ROUTE);
    return response.data;
  } catch (error) {
    console.log("get Product Error", { error });
    return false;
  }
};

const update = async (id, data) => {
  try {
    const response = await instance.put(`${PRODUCT_ROUTE}/${id}`, data);
    return response.data;
  } catch (error) {
    console.log("update Product Error", { error });
    return false;
  }
};

const deleteProduct = async (id) => {
  try {
    const response = await instance.delete(`${PRODUCT_ROUTE}/${id}`);
    return response.data;
  } catch (error) {
    console.log("get Product Error", { error });
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
