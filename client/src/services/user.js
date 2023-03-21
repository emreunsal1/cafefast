import { LOGIN_PAGE_URl } from "../constants";
import instance from "../utils/axios";

const login = async (email, password) => {
  try {
    const response = await instance.post(LOGIN_PAGE_URl, {
      email,
      password,
    });
    const result = response.data;
    return result;
  } catch (error) {
    console.log("login error", { error });
  }
};

const register = async (data) => {
  try {
    const { name, surname, company, phone, address } = data;
    const response = await instance.post(LOGIN_PAGE_URl, {
      name,
      surname,
      company,
      phone,
      address,
    });
    const result = response.data;
    return result;
  } catch (error) {
    console.log("register error", { error });
  }
};

const USER_SERVICE = {
  login,
};

export default USER_SERVICE;
