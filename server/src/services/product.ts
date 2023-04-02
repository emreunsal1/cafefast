import productModel, { IProduct } from "../models/product";

export const createProduct = async (productData: IProduct) => {
  try {
    const newMenu = await productModel.create(productData);
    return { data: newMenu };
  } catch (error) {
    return { error: (error as any).message || error };
  }
};

export const updateProduct = async (productId, data) => {
  try {
    const newMenu = await productModel.findOneAndUpdate({ _id: productId }, data, { new: true });
    return { data: newMenu };
  } catch (error) {
    return { error: (error as any).message || error };
  }
};

export const deleteProduct = async (productId) => {
  try {
    await productModel.deleteOne({ _id: productId });
    return { data: true };
  } catch (error) {
    return { error: (error as any).message || error };
  }
};
