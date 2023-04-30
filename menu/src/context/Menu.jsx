import React, { createContext, useContext, useState } from "react";
import MENU_SERVICE from "../services/menu";

const Context = createContext({});

export function MenuContext({ children }) {
  const [menu, setMenu] = useState(null);
  const [products, setProducts] = useState([]);
  const categories = menu?.categories;

  console.log("products context", products);
  const getProductsWithCategory = (categoryId, activeMenu) => {
    if (menu === null) {
      const result = activeMenu.categories.find((category) => category._id === categoryId).products;
      console.log("result1", result);
      setProducts(result);
      return;
    }
    const result = categories.find((category) => category._id === categoryId).products;
    setProducts(result);
  };

  const getMenu = async (menuId) => {
    const response = await MENU_SERVICE.getMenu("64208d2c890cdcf8376c87a5");
    setMenu(response.data);
    const { data } = response;
    const resultCategories = data.categories.map((category) => ({ name: category.name, _id: category._id }));
    if (!products.length) {
      getProductsWithCategory(resultCategories[0]._id, data);
    }
    return data;
  };

  return (
    <Context.Provider value={{
      menu, categories, products, getMenu, getProductsWithCategory,
    }}
    >
      {children}
    </Context.Provider>
  );
}

export const useMenu = () => useContext(Context);
