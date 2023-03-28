import categoryModel, { ICategory } from "../models/category";

export const createCategory = async (categoryData: ICategory) => {
  try {
    const newMenu = await categoryModel.create(categoryData);
    return { data: newMenu };
  } catch (error) {
    return { error };
  }
};