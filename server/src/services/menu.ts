import menuModel, { IMenu } from "../models/menu";
import { getCompany, removeMenuFromCompany } from "./company";

export const createMenu = async (menuData: IMenu) => {
  try {
    const newMenu = await menuModel.create(menuData);
    return { data: newMenu };
  } catch (error) {
    return { error };
  }
};

export const getMenus = async (companyId) => {
  const companyData = await getCompany({ query: { _id: companyId }, populate: false });

  if (!companyData.data || companyData.error) {
    return {
      error: "Company not found",
    };
  }
  try {
    const query = menuModel.find({ _id: { $in: companyData.data.menus } });

    query.populate("categories");
    query.populate("categories.products");
    // query.populate("campaigns");
    // query.populate("campaigns.products");

    const result = await query.exec();

    return {
      data: result,
    };
  } catch (err) {
    return {
      error: err,
    };
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
