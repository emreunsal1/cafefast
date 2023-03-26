import productModel, { IProduct } from "../models/product";

export const createProduct = async (menuData: IProduct) => {
  try {
    const newMenu = await productModel.create(menuData);
    return { data: newMenu };
  } catch (error) {
    return { error };
  }
};
