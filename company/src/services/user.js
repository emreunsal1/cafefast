import instance from "../utils/axios";
import { AUTH_PAGE_URL, LOCAL_COMPANY_ID_KEY, USER_PATH } from "../constants";

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
    return false;
  }
};

const update = async ({ name, surname, phoneNumber }) => {
  try {
    const response = await instance.put("/me", {
      name,
      surname,
      phoneNumber,
    });
    return response;
  } catch (error) {
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
    return false;
  }
};

// eslint-disable-next-line consistent-return
const me = async () => {
  try {
    const response = await instance.get("/me");
    const companyId = response.data.company?._id;
    if (!companyId) {
      window.location.assign("/auth/onboarding");
      return;
    }
    const localCompanyId = localStorage.getItem(LOCAL_COMPANY_ID_KEY);
    if (!localCompanyId || localCompanyId !== companyId) {
      localStorage.setItem(LOCAL_COMPANY_ID_KEY, companyId);
    }

    return { data: response };
  } catch (error) {
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
