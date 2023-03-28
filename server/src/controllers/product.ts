import { Request, Response } from "express";
import { createProductValidator } from "../models/product";
import { createProduct } from "../services/product";

export const createProductController = async (req: Request, res: Response) => {
  const { company } = req.user;
  const { menuId, categoryId } = req.params;

  const validatedPoruct = await createProductValidator.parseAsync(req.body);

  const createdProduct = await createProduct(validatedPoruct);

  if (!createdProduct.data || createdProduct.error) {
    return res.send({
      error: createdProduct.error,
    });
  }
};
