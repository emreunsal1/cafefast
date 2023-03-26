import menuModel, { IMenu } from "../models/menu";
import { removeMenuFromCompany } from "./company";

export const createMenu = async (menuData: IMenu) => {
  try {
    const newMenu = await menuModel.create(menuData);
    return { data: newMenu };
  } catch (error) {
    return { error };
  }
};

export const deleteMenu = async (menuId, companyId) => {
  try {
    const data = await removeMenuFromCompany(menuId, companyId);
    await menuModel.findOneAndDelete({ _id: menuId });
    return { data };
  } catch (error) {
    return { error };
  }
};
