import React, {
  createContext, useContext, useEffect, useState,
} from "react";
import MENU_SERVICE from "../services/menu";

const Context = createContext({});

export function MenuContext({ children }) {
  const [menu, setMenu] = useState(null);
  const [products, setProducts] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const categories = menu?.categories;

  const getProductsWithCategory = (categoryId, activeMenu) => {
    if (menu === null && selectedCategory === null) {
      const result = activeMenu.categories.find((category) => category._id === categoryId).products;
      setProducts(result);
      return;
    }
    const result = categories.find((category) => category._id === selectedCategory).products;
    setProducts(result);
  };

  const getMenu = async (menuId) => {
    const { data } = await MENU_SERVICE.getMenu(menuId);

    if (data) {
      setMenu(data);
      setCampaigns(data?.campaigns || []);
      const resultCategories = data.categories.map((category) => ({ name: category.name, _id: category._id }));

      if (!products.length) {
        getProductsWithCategory(resultCategories[0]._id, data);
      }
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
      menu, categories, products, campaigns, selectedCategory, getMenu, getProductsWithCategory, setSelectedCategory,
    }}
    >
      {children}
    </Context.Provider>
  );
}

export const useMenu = () => useContext(Context);
