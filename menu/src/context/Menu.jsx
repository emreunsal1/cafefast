import React, {
  createContext, useContext, useEffect, useState,
} from "react";
import MENU_SERVICE from "../services/menu";

const Context = createContext({});

export function MenuContext({ children }) {
  const [menu, setMenu] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const categories = menu?.categories;

  const getProductsWithCategory = (categoryId, activeMenu) => {
    if (menu === null && selectedCategory === null) {
      const result = activeMenu.categories.find((category) => category._id === categoryId).products;
      setProducts(result);
      return;
    }
    const result = categories.find((category) => category._id === selectedCategory).products;
    console.log("products result", result);
    setProducts(result);
  };

  const getMenu = async (menuId) => {
    const response = await MENU_SERVICE.getMenu("64208d2c890cdcf8376c87a5");
    setMenu(response.data);
    const { data } = response;
    const resultCategories = data.categories.map((category) => ({ name: category.name, _id: category._id }));
    setSelectedCategory(resultCategories[0]._id);
    if (!products.length) {
      getProductsWithCategory(resultCategories[0]._id, data);
    }
    return data;
  };

  useEffect(() => {
    if (selectedCategory !== null) {
      getProductsWithCategory();
    }
  }, [selectedCategory]);

  return (
    <Context.Provider value={{
      menu, categories, products, selectedCategory, getMenu, getProductsWithCategory, setSelectedCategory,
    }}
    >
      {children}
    </Context.Provider>
  );
}

export const useMenu = () => useContext(Context);
