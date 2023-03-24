import { AUTH_PAGE_URL } from "../constants";
import instance from "../utils/axios";

const login = async (email, password) => {
  try {
    const response = await instance.post(`${AUTH_PAGE_URL}/login`, {
      email,
      password,
    });
    return response;
  } catch (error) {
    console.log("login error", { error });
    return false;
  }
};

const AUTH_SERVICE = {
  login,
};

export default AUTH_SERVICE;
