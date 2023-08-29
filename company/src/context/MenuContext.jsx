import React, { createContext, useContext, useState } from "react";
import { CATEGORY_SERVICE, MENU_SERVICE } from "../services/menu";
import { useMessage } from "./GlobalMessage";

const Context = createContext({});

export function MenuContext({ children }) {
  const [menu, setMenu] = useState(null);
  const [categories, setCategories] = useState([]);
  const sendGlobalMessage = useMessage();

  const getMenu = async (menuId) => {
    const response = await MENU_SERVICE.detail(menuId);
    setMenu(response.data);
    setCategories(response.data.categories);
    return response.data;
  };

  const addCategory = async (menuId, categoryName, order) => {
    try {
      const response = await CATEGORY_SERVICE.createCategory(menuId, categoryName, order);
      setCategories([...categories, response.data]);
    } catch (error) {
      if (error.response.data.error === "CATEGORY_NAME_MUST_BE_UNIQUE") {
        sendGlobalMessage("error", "category name must be unique");
      }
    }
  };

  const updateCategory = async (menuId, data) => {
    try {
      const response = await CATEGORY_SERVICE.updateCategory(menuId, data);
      const foundCategoryIndex = categories.findIndex((_category) => _category._id === data._id);
      const newCategories = [...categories];
      newCategories[foundCategoryIndex] = response.data.data;
      setCategories(newCategories);
    } catch (error) {
      if (error.response.data.error === "CATEGORY_NAME_MUST_BE_UNIQUE") {
        sendGlobalMessage("error", "category name must be unique");
      }
    }
  };

  return (
    <Context.Provider value={{
      menu, categories, setCategories, addCategory, getMenu, updateCategory,
    }}
    >
      {children}
    </Context.Provider>
  );
}

export const useMenu = () => useContext(Context);
