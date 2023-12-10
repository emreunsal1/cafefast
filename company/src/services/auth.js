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
    return false;
  }
};

const logout = async () => {
  try {
    const response = await instance.post(`${AUTH_PAGE_URL}/logout`);
    window.location.assign("/auth/login");
    return response;
  } catch (error) {
    return false;
  }
};

const AUTH_SERVICE = {
  login, logout,
};

export default AUTH_SERVICE;
