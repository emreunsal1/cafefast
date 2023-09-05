import React, { createContext, useContext, useState } from "react";
import { CATEGORY_SERVICE, MENU_SERVICE } from "../services/menu";
import { useMessage } from "./GlobalMessage";
import CAMPAIGN_SERVICE from "@/services/campaign";

const Context = createContext({});

export function MenuDetailContext({ children }) {
  const [menu, setMenu] = useState(null);
  const [categories, setCategories] = useState([]);
  const [campaings, setCampaings] = useState([]);
  const sendGlobalMessage = useMessage();

  const getMenu = async (menuId) => {
    const response = await MENU_SERVICE.detail(menuId);
    setMenu(response.data);
    setCategories(response.data.categories);
    setCampaings(response.data.campaigns);
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

  const removeCampaings = async (menuId, data) => {
    try {
      console.log("context gelen data", data);
      CAMPAIGN_SERVICE.removeCampaingFromMenu(menuId, data._id);

      const filteredCampaings = campaings.filter((campain) => campain._id !== data._id);
      setCampaings(filteredCampaings);
      return true;
    } catch (error) {
      return false;
    }
  };

  return (
    <Context.Provider value={{
      menu, categories, campaings, setCategories, addCategory, getMenu, updateCategory, removeCampaings,
    }}
    >
      {children}
    </Context.Provider>
  );
}

export const useMenuDetail = () => useContext(Context);
