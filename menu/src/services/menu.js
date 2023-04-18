const { MENU_ROUTE, ROUTES } = require("../../constants");
const { default: instance } = require("../../utils/axios");



const getMenu  = async (companyId)=>{
  try {
    const response = await instance.get(`${ROUTES.COMPANY}/${companyId}/active-menu`);
    console.log("response", response.data);
    return response;
  
  } catch (error) {
    console.log("get menu error", {error});
    return false;
  }
}



const MENU_SERVICE = {
  getMenu
}

export default MENU_SERVICE;