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

export const bulkUpdateProducts = async (newProducts) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const productsWithoutId = newProducts.map(({ _id, ...product }) => product);
  const onlyIds = newProducts.map((product) => product._id);

  const query = onlyIds.map((id, index) => ({
    updateOne: {
      filter: {
        _id: id,
      },
      update: productsWithoutId[index],
    },
  }));

  try {
    const result = await productModel.bulkWrite(query);
    return { data: result };
  } catch (error) {
    return { error: (error as any).message || error };
  }
};

export const bulkCreateProducts = async (newProducts) => {
  try {
    const result = await productModel.insertMany(newProducts);
    return { data: result };
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
