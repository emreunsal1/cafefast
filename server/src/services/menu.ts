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

export const addCategoryToMenu = async (query: Partial<IMenu & {_id: any}>, categoryId: any):Promise<{data?: any, error?: any}> => {
  try {
    const response = await menuModel.findOneAndUpdate(
      query,
      { $push: { categories: categoryId } },
      { new: true },
    ).exec();

    return { data: response };
  } catch (error) {
    return { error };
  }
};

export const deleteMenu = async (menuId, companyId) => {
  try {
    const { data, error } = await removeMenuFromCompany(menuId, companyId);
    if (error) {
      return { error };
    }
    await menuModel.findOneAndDelete({ _id: menuId });
    return { data };
  } catch (error) {
    return { error };
  }
};
