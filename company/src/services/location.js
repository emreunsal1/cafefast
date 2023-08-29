import { ADRESS_ROUTE } from "../constants";
import instance from "../utils/axios";

const getCities = async () => {
  try {
    const response = await instance.get(ADRESS_ROUTE);
    return response;
  } catch (error) {
    console.log("get Cities error", { error });
    return false;
  }
};

const getDistrict = async (cityID) => {
  try {
    const response = await instance.get(`${ADRESS_ROUTE}/${cityID}/districts`);
    return response;
  } catch (error) {
    console.log("get District error", { error });
    return false;
  }
};

const LOCATION_SERVICE = {
  getCities,
  getDistrict,
};

export default LOCATION_SERVICE;
