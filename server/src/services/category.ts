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

export const deleteCategoriesWithIds = async (categoryIds) => categoryModel.deleteMany({ _id: { $in: categoryIds } }).exec();

export const updateCategory = async (categoryId, data) => {
  try {
    const result = await categoryModel.findOneAndUpdate({ _id: categoryId }, data, { new: true });
    return { data: result };
  } catch (error) {
    return { error: (error as any).message || error };
  }
};

export const addProductToCategory = async (categoryId, productId) => {
  try {
    const data = await categoryModel.findOneAndUpdate(
      { _id: categoryId },
      { $push: { products: productId } },
      { new: true },
    ).exec();
    return { data };
  } catch (error) {
    return { error: (error as any).message || error };
  }
};

export const deleteProductFromCategory = async (categoryId, productId) => {
  try {
    const data = await categoryModel.findOneAndUpdate(
      { _id: categoryId },
      { $pull: { products: productId } },
      { new: true },
    ).exec();
    return { data };
  } catch (error) {
    return { error: (error as any).message || error };
  }
};

export const removeProductsFromAllCategories = async (productId) => {
  try {
    const data = await categoryModel.updateMany(
      { products: productId },
      { $pull: { products: productId } },
    ).exec();
    return { data };
  } catch (error) {
    return { error: (error as any).message || error };
  }
};
