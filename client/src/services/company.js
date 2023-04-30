import instance from "../utils/axios";

const update = async (data) => {
  try {
    const response = await instance.put("/company", data);
    return response;
  } catch (error) {
    console.log("update company error", { error });
    return false;
  }
};

const COMPANY_SERVICE = {
  update,
};

export default COMPANY_SERVICE;
