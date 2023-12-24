import React, { createContext, useContext, useState } from "react";
import { useRouter } from "next/router";
import { useImmer } from "use-immer";
import CAMPAIGN_SERVICE from "@/services/campaign";
import { CATEGORY_SERVICE, MENU_SERVICE } from "../services/menu";
import { useMessage } from "./GlobalMessage";
import { useLoading } from "./LoadingContext";

const Context = createContext({});

export function MenuDetailContext({ children }) {
  const [menu, setMenu] = useImmer(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState();
  const message = useMessage();

  const router = useRouter();
  const { setLoading } = useLoading();

  const getMenu = async (menuId = router.query.menuId) => {
    setLoading(true);
    const response = await MENU_SERVICE.detail(menuId);
    setMenu(response.data);
    setLoading(false);
    return response.data;
  };

  const addCategory = async (menuId, categoryName, order) => {
    try {
      const response = await CATEGORY_SERVICE.createCategory(menuId, categoryName, order);
      const newCategories = menu.categories;
      newCategories.push(response.data);
      setMenu((_menu) => { _menu.categories = newCategories; });
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
      const foundCategoryIndex = menu.categories.findIndex((_category) => _category._id === data._id);
      const newCategories = [...menu.categories];
      newCategories[foundCategoryIndex] = response.data;
      setMenu((_menu) => { _menu.categories = newCategories; });
      setLoading(false);
    } catch (error) {
      if (error.response.data.error === "CATEGORY_NAME_MUST_BE_UNIQUE") {
        message.error("category name must be unique");
      }
    }
  };

  const sortMenuCategoriesWithIds = async (newCategories) => {
    const oldCategories = menu.categories;
    setMenu((_menu) => { _menu.categories = newCategories; });
    try {
      const categoryIds = newCategories.map((_category) => _category._id);
      await MENU_SERVICE.update(router.query.menuId, { categories: categoryIds });
    } catch (err) {
      setMenu((_menu) => { _menu.categories = oldCategories; });
    }
  };

  const deleteCategory = async (categoryId) => {
    setLoading(true);
    await CATEGORY_SERVICE.deleteCategory(router.query.menuId, categoryId);
    const filteredCategory = menu.categories.filter((category) => category._id !== categoryId);
    setSelectedCategoryId(null);
    setMenu((_menu) => { _menu.categories = filteredCategory; });
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
      selectedCategoryId,
      addCategory,
      getMenu,
      updateCategory,
      sortMenuCategoriesWithIds,
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
