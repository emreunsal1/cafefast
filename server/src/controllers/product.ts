import { Request, Response } from "express";
import { createProductValidator } from "../models/product";
import { createProduct } from "../services/product";
import { addProductToCategory } from "../services/category";

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
