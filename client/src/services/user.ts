import { LOGIN_PAGE_URl } from "../constants";
import instance from "../utils/axios";

const login = async (email:string, password:string) => {
  const response = await instance.post(LOGIN_PAGE_URl, {
    email,
    password,
  });
  const result = response.data;
  return result;
};

const USER_SERVICE = {
  login,
};

export default USER_SERVICE;
