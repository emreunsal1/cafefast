import { Request, Response } from "express";
import { createProductValidator, updateProductValidator } from "../models/product";
import { createProduct, deleteProduct, updateProduct } from "../services/product";
import { addProductToCategory, deleteProductFromCategory } from "../services/category";

export const createProductController = async (req: Request, res: Response) => {
  const { categoryId } = req.params;

  try {
    const validatedPoruct = await createProductValidator.parseAsync(req.body);

    const createdProduct = await createProduct(validatedPoruct);
    if (!createdProduct.data || createdProduct.error) {
      return res.status(400).send({
        error: createdProduct.error,
      });
    }
    const newCategory = await addProductToCategory(categoryId, createdProduct.data._id);
    if (newCategory.error || !newCategory.data) {
      return res.status(400).send(newCategory.error);
    }
    res.send(newCategory.data);
  } catch (error) {
    res.status(400).send({
      error: (error as any).message || error,
    });
  }
};

export const updateProductController = async (req: Request, res: Response) => {
  const { productId } = req.params;

  try {
    const validatedProduct = await updateProductValidator.parseAsync(req.body);
    const updatedProduct = await updateProduct(productId, validatedProduct);

    if (!updatedProduct.data || updatedProduct.error) {
      return res.status(400).send({
        error: updatedProduct.error,
      });
    }
    res.send(updatedProduct.data);
  } catch (error) {
    res.status(400).send({
      error,
    });
  }
};

export const deleteProductController = async (req: Request, res: Response) => {
  const { productId, categoryId } = req.params;

  try {
    const categoryData = await deleteProductFromCategory(categoryId, productId);
    if (categoryData.error) {
      return res.status(400).send(categoryData.error);
    }
    const updatedProduct = await deleteProduct(productId);

    if (!updatedProduct.data || updatedProduct.error) {
      return res.status(400).send({
        error: updatedProduct.error,
      });
    }
    res.send(updatedProduct.data);
  } catch (error) {
    res.status(400).send({
      error,
    });
  }
};
