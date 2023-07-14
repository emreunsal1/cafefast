const { default: instance } = require("../../utils/axios");

const getMenu = async (companyId) => {
  try {
    const response = await instance.get(`/active-menu/${companyId}`);
    return response;
  } catch (error) {
    return false;
  }
};

const MENU_SERVICE = {
  getMenu,
};

export default MENU_SERVICE;
