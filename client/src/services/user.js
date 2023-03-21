import instance from "../utils/axios";
import { USER_PATH } from "../constants";

const create = async (data) => {
  try {
    const {
      email, phone, password,
    } = data;
    const response = await instance.post(`${USER_PATH}/register`, {
      email, phone, password,
    });
    const result = response.data;
    return result;
  } catch (error) {
    console.log("register error", { error });
    return false;
  }
};

const update = async (data) => {
  try {
    const response = await instance.put(`${USER_PATH}/update`, {
      data,
    });
    const result = response.data;
    return result;
  } catch (error) {
    console.log("user update error", { error });
    return false;
  }
};

const USER_SERVICE = {
  update,
  create,
};

export default USER_SERVICE;
