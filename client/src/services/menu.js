import instance from "../utils/axios";

const { MENU_ROUTE } = require("../constants");

const get = async () => {
  try {
    const response = await instance.get(MENU_ROUTE);
    return response;
  } catch (error) {
    console.log("menu get request error", { error });
    return false;
  }
};

const create = async (name) => {
  try {
    const response = await instance.post(MENU_ROUTE, {
      name,
    });
    return response;
  } catch (error) {
    console.log("create menu error", { error });
    return false;
  }
};

const update = async (id, name) => {
  try {
    const resposne = instance.put(`${MENU_ROUTE}/${id}`, {
      name,
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

export const MENU_SERVICE = {
  get,
  create,
  update,
  deleteMenu,
};

export const CATEGORY_SERVICE = {
  createCategory,
};
