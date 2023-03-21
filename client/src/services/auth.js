import { AUTH_PAGE_URL } from "../constants";
import instance from "../utils/axios";

const login = async (email, password) => {
  try {
    const response = await instance.post(AUTH_PAGE_URL + "/login", {
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
    const response = await instance.post(AUTH_PAGE_URL + "/register", {
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

const AUTH_SERVİCE = {
  login,
  register,
};

export default AUTH_SERVİCE;
