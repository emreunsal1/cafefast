import React, { createContext, useContext, useState } from "react";
import { useRouter } from "next/router";
import { CATEGORY_SERVICE, MENU_SERVICE } from "../services/menu";
import { useMessage } from "./GlobalMessage";
import CAMPAIGN_SERVICE from "@/services/campaign";
import { useLoading } from "./LoadingContext";

const Context = createContext({});

export function MenuDetailContext({ children }) {
  const [menu, setMenu] = useState(null);
  const [categories, setCategories] = useState([]);
  const [campaings, setCampaings] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState();
  const message = useMessage();

  const router = useRouter();
  const { setLoading } = useLoading();

  const getMenu = async (menuId = router.query.menuId) => {
    setLoading(true);
    const response = await MENU_SERVICE.detail(menuId);
    setMenu(response.data);
    setCategories(response.data.categories);
    setCampaings(response.data.campaigns);
    setLoading(false);
    return response.data;
  };

  const addCategory = async (menuId, categoryName, order) => {
    try {
      const response = await CATEGORY_SERVICE.createCategory(menuId, categoryName, order);
      setCategories([...categories, response.data]);
      return response.data;
    } catch (error) {
      if (error.response.data.error === "CATEGORY_NAME_MUST_BE_UNIQUE") {
        message.error("category name must be unique");
      }
    }
  };

  const updateCategory = async (data) => {
    try {
      setLoading(true);
      const response = await CATEGORY_SERVICE.updateCategory(router.query.menuId, data);
      const foundCategoryIndex = categories.findIndex((_category) => _category._id === data._id);
      const newCategories = [...categories];
      newCategories[foundCategoryIndex] = response.data;
      setCategories(newCategories);
      setLoading(false);
    } catch (error) {
      if (error.response.data.error === "CATEGORY_NAME_MUST_BE_UNIQUE") {
        message.error("category name must be unique");
      }
    }
  };

  const deleteCategory = async (categoryId) => {
    setLoading(true);
    await CATEGORY_SERVICE.deleteCategory(router.query.menuId, categoryId);
    const filteredCategory = categories.filter((category) => category._id !== categoryId);
    setSelectedCategoryId(null);
    setCategories(filteredCategory);
    router.push(`/menu/${router.query.menuId}/`);
    setLoading(false);
  };

  const removeCampaings = async (menuId, data) => {
    try {
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
      menu,
      categories,
      campaings,
      selectedCategoryId,
      setCategories,
      addCategory,
      getMenu,
      updateCategory,
      deleteCategory,
      removeCampaings,
      setSelectedCategoryId,
    }}
    >
      {children}
    </Context.Provider>
  );
}

export const useMenuDetail = () => useContext(Context);
