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

// eslint-disable-next-line consistent-return
const me = async () => {
  try {
    const response = await instance.get("/me");
    return { data: response };
  } catch (error) {
    console.log("get me error", error);
    return { error: error.response };
  }
};

const USER_SERVICE = {
  update,
  create,
  me,
};

export default USER_SERVICE;
