import instance from "../utils/axios";
import { PROFILE_PAGE_URL } from "../constants";

const update = async (data) => {
  try {
    const response = await instance.put(PROFILE_PAGE_URL + "/update", {
      data,
    });
    const result = response.data;
    return result;
  } catch (error) {
    console.log("user update error", { error });
  }
};

const USER_SERVICE = {
  update,
};

export default USER_SERVICE;
