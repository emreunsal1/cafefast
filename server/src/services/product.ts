import companyModel from "../models/company";
import productModel, { IProduct } from "../models/product";

export const getAllProducts = async (companyId) => {
  try {
    const product = await companyModel.findOne({ _id: companyId }).populate("products").select("products");
    return { data: product };
  } catch (error) {
    return { error: (error as any).message || error };
  }
};

export const createProduct = async (productData: IProduct) => {
  try {
    const newProduct = await productModel.create(productData);
    return { data: newProduct };
  } catch (error) {
    return { error: (error as any).message || error };
  }
};

export const updateProduct = async (productId, data) => {
  try {
    const newProduct = await productModel.findOneAndUpdate({ _id: productId }, data, { new: true });
    return { data: newProduct };
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
