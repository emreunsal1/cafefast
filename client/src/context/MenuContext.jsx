import React, { createContext, useContext, useState } from "react";
import { CATEGORY_SERVICE, MENU_SERVICE } from "../services/menu";

const Context = createContext({});

export function MenuContext({ children }) {
  const [menu, setMenu] = useState(null);
  const [categories, setCategories] = useState([]);

  const getMenu = async (menuId) => {
    const response = await MENU_SERVICE.detail(menuId);
    setMenu(response.data);
    setCategories(response.data.categories);
    return response.data;
  };

  const addCategory = async (menuId, categoryName, order) => {
    const response = await CATEGORY_SERVICE.createCategory(menuId, categoryName, order);
    setCategories([...categories, response.data]);
  };

  const updateCategory = async (menuId, data) => {
    const response = await CATEGORY_SERVICE.updateCategory(menuId, data);
    const foundCategoryIndex = categories.findIndex((_category) => _category._id === data._id);
    const newCategories = [...categories];
    newCategories[foundCategoryIndex] = response.data.data;
    setCategories(newCategories);
  };

  return (
    <Context.Provider value={{
      menu, categories, addCategory, getMenu, updateCategory,
    }}
    >
      {children}
    </Context.Provider>
  );
}

export const useMenu = () => useContext(Context);
