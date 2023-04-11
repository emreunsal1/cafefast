import React, { createContext, useContext, useState } from "react";
import { CATEGORY_SERVICE, MENU_SERVICE } from "../services/menu";

const Context = createContext({});

export function MenuContext({ children }) {
  const [menu, setMenu] = useState([]);
  const [categories, setCategories] = useState([]);

  const getMenu = async (menuId) => {
    const response = await MENU_SERVICE.detail(menuId);
    setMenu(response.data);
    const mutateCategories = response.data.categories.map((category) => ({ id: category._id, name: category.name }));
    setCategories(mutateCategories);
  };

  const addCategory = async (menuId, categoryName, order) => {
    const response = await CATEGORY_SERVICE.createCategory(menuId, categoryName, order);
    const { name, _id: id } = response.data;
    setCategories([...categories, { name, id }]);
  };

  return (
    <Context.Provider value={{
      menu, categories, addCategory, getMenu,
    }}
    >
      {children}
    </Context.Provider>
  );
}

export const useMenu = () => useContext(Context);
