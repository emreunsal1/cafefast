import instance from "../utils/axios";

const { MENU_ROUTE } = require("../constants");

// MENUS SERVICE

const get = async () => {
  try {
    const response = await instance.get(MENU_ROUTE);
    return response;
  } catch (error) {
    console.log("menu get request error", { error });
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
    console.log("create menu error", { error });
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
    console.log("menu update error", { error });
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
    console.log("delete menu error", { error });
    return false;
  }
};

// MENU

const detail = async (menuId) => {
  try {
    const response = await instance.get(`${MENU_ROUTE}/${menuId}`);
    return response;
  } catch (error) {
    console.log("get menu detail error", { error });
    return false;
  }
};

// CATEGORY SERVICE

const createCategory = async (menuID, name, order) => {
  try {
    const response = await instance.post(`${MENU_ROUTE}/${menuID}/category`, { name, order });
    return response;
  } catch (error) {
    console.log("abc create category error", { error });
    return false;
  }
};

const updateCategory = async (menuId, data) => {
  try {
    const response = await instance.put(`${MENU_ROUTE}/${menuId}/category/${data._id}`, data);
    return response;
  } catch (error) {
    console.log("abc update category error", { error });
    return false;
  }
};

// product
const addProduct = async (menuId, categoryId, productId) => {
  try {
    const response = await instance.post(`${MENU_ROUTE}/${menuId}/category/${categoryId}/product/${productId}`);
    return response.data;
  } catch (error) {
    console.log("add Product to category Error", { error });
    return false;
  }
};

const deleteProduct = async (menuId, categoryId, ProductId) => {
  try {
    const response = await instance.delete(`${MENU_ROUTE}/${menuId}/category/${categoryId}/product/${ProductId}`);
    return response.data;
  } catch (error) {
    console.log("delete Product to category Error", { error });
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
  deleteProduct,
};
