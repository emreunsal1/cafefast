import menuModel, { IMenu } from "../models/menu";

export const createMenu = async (menuData) => {
  try {
    const newMenu = await menuModel.create(menuData);
    return { data: newMenu };
  } catch (error) {
    return { error: (error as any).message || error };
  }
};

export const getMenus = async (menuIds) => {
  try {
    const result = await menuModel.find({ _id: { $in: menuIds } }).exec();
    return {
      data: result,
    };
  } catch (error) {
    return {
      error: (error as any).message || error,
    };
  }
};

export const getMenu = async (menuId) => {
  try {
    const result = await menuModel.findOne({ _id: menuId }).populate({
      path: "categories",
      populate: {
        path: "products",
        model: "product",
      },
    }).populate({
      path: "campaigns",
      populate: {
        path: "products",
        model: "product",
      },
    }).exec();

    return {
      data: result,
    };
  } catch (error) {
    return {
      error: (error as any).message || error,
    };
  }
};

export const getMenuWithId = async (menuId, populate = true) => {
  const query = menuModel.findOne({
    _id: menuId,
  });

  if (populate) {
    query.populate("campaigns").populate("categories");
  }

  return query.exec();
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
    return { error: (error as any).message || error };
  }
};

export const addCampaignToMenu = async ({ menuId, campaignId }) => {
  try {
    const response = await menuModel.findOneAndUpdate(
      { _id: menuId },
      { $push: { campaigns: campaignId } },
      { new: true },
    ).exec();

    return { data: response };
  } catch (error) {
    return { error: (error as any).message || error };
  }
};

export const deleteMenu = async (menuId) => {
  try {
    const data = await menuModel.findOneAndDelete({ _id: menuId });
    return { data };
  } catch (error) {
    return { error: (error as any).message || error };
  }
};

type UpdateMenuParams = {
  query: {
    menuId: any;
  };
  data: any;
};

export const updateMenu = async ({ query, data }: UpdateMenuParams) => {
  try {
    const result = await menuModel.findOneAndUpdate({ _id: query.menuId }, data, { new: true });
    return { data: result };
  } catch (error) {
    return { error: (error as any).message || error };
  }
};

export const removeCategoryFromMenu = async (categoryId) => {
  try {
    await menuModel.findOneAndUpdate({ categories: categoryId }, { $pull: { categories: categoryId } });
    return { data: true };
  } catch (error) {
    return { error: (error as any).message || error };
  }
};

export const removeCampaignFromMenu = async (campaignId) => {
  try {
    const response = await menuModel.updateMany({ campaigns: campaignId }, { $pull: { campaigns: campaignId } });
    return { data: response.modifiedCount > 0, error: response.modifiedCount < 0 && "menus are not updated" };
  } catch (error) {
    return { error: (error as any).message || error };
  }
};
