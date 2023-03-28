import categoryModel, { ICategory } from "../models/category";

export const createCategory = async (categoryData: ICategory) => {
  try {
    const newMenu = await categoryModel.create(categoryData);
    return { data: newMenu };
  } catch (error) {
    return { error: (error as any).message || error };
  }
};

export const deleteCategory = async (categoryId) => {
  try {
    await categoryModel.deleteOne({ _id: categoryId });
    return { data: true };
  } catch (error) {
    return { error: (error as any).message || error };
  }
};
