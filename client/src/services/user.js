import instance from "../utils/axios";
import { AUTH_PAGE_URL, USER_PATH } from "../constants";

const create = async (data) => {
  try {
    const {
      email, phone, password,
    } = data;
    const response = await instance.post(`${AUTH_PAGE_URL}/register`, {
      email, phone, password,
    });
    return response;
  } catch (error) {
    console.log("register error", { error });
    return false;
  }
};

const update = async (data) => {
  try {
    console.log("data", data);
    // const response = await instance.put(`${USER_PATH}/update`, {
    //   data,
    // });

    // return response;
  } catch (error) {
    console.log("user update error", { error });
    return false;
  }
};

const compeleteOnboarding = async (data) => {
  try {
    const { user, company } = data;
    const response = await instance.post("/me/complete-onboarding", {
      user,
      company,
    });
    return response;
  } catch (error) {
    console.log("compeleteOnboarding error", { error });
  }
};

// eslint-disable-next-line consistent-return
const me = async () => {
  try {
    const response = await instance.get("/me");
    const companyId = response.data.company;
    if (!companyId) {
      window.location.assign("/auth/onboarding");
      return;
    }

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
  compeleteOnboarding,
};

export default USER_SERVICE;
