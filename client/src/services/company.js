import instance from "../utils/axios";

const update = async ({ name, address }) => {
  try {
    console.log("data", { name, address });
    const response = await instance.put("/company", { name, address });
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
