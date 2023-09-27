import instance from "../utils/axios";

const { MENU_ROUTE } = require("../constants");

// MENUS SERVICE
const get = async () => {
  try {
    const response = await instance.get(MENU_ROUTE);
    return response;
  } catch (error) {
    return false;
  }
};

const create = async (name, desc) => {
  try {
    const response = await instance.post(MENU_ROUTE, {
      name,
      description: desc,
    });
    return response;
  } catch (error) {
    return false;
  }
};

const update = async (id, { name, description }) => {
  try {
    const resposne = instance.put(`${MENU_ROUTE}/${id}`, {
      name,
      description,
    });
    return resposne;
  } catch (error) {
    return false;
  }
};

const deleteMenu = async (id) => {
  try {
    const response = await instance.delete(`${MENU_ROUTE}/${id}`);
    if (response.status === 200) {
      return true;
    }
  } catch (error) {
    return false;
  }
};

// MENU

const detail = async (menuId) => {
  try {
    const response = await instance.get(`${MENU_ROUTE}/${menuId}`);
    return response;
  } catch (error) {
    return false;
  }
};

// CATEGORY SERVICE

const createCategory = async (menuID, name, order) => instance.post(`${MENU_ROUTE}/${menuID}/category`, { name, order });

const updateCategory = (menuId, data) => instance.put(`${MENU_ROUTE}/${menuId}/category/${data._id}`, data);

// product
const addProduct = async (menuId, categoryId, productId) => {
  try {
    const response = await instance.post(`${MENU_ROUTE}/${menuId}/category/${categoryId}/product/${productId}`);
    return response.data;
  } catch (error) {
    return false;
  }
};

const deleteCategory = async (menuId, categoryId) => {
  try {
    const response = await instance.delete(`${MENU_ROUTE}/${menuId}/category/${categoryId}`);
    return response.data;
  } catch (error) {
    return false;
  }
};

export const MENU_SERVICE = {
  get,
  create,
  update,
  deleteMenu,
  detail,
};

export const CATEGORY_SERVICE = {
  createCategory,
  updateCategory,
  addProduct,
  deleteCategory,
};
