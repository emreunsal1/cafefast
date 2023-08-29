import { Request, Response } from "express";
import { createProductValidator, updateProductValidator } from "../models/product";
import {
  createProduct, deleteProduct, getAllProducts, updateProduct,
} from "../services/product";
import {
  addProductToCategory, checkCategoryHasProduct, deleteProductFromCategory, removeProductsFromAllCategories,
} from "../services/category";
import { addProductToCompany } from "../services/company";
import { mapProduct } from "../utils/mappers";

export const getAllProductsController = async (req: Request, res: Response) => {
  const { company } = req.user;
  try {
    const productsResponse = await getAllProducts(company);
    if (!productsResponse.data || productsResponse.error) {
      return res.status(400).send({
        error: productsResponse.error,
      });
    }
    res.send(productsResponse.data.toObject().products?.map(mapProduct));
  } catch (error) {
    res.status(400).send({
      error: (error as any).message || error,
    });
  }
};

export const createProductController = async (req: Request, res: Response) => {
  const { company: companyId } = req.user;
  try {
    const validatedPoruct = await createProductValidator.parseAsync(req.body);

    const createdProduct = await createProduct(validatedPoruct);
    if (!createdProduct.data || createdProduct.error) {
      return res.status(400).send({
        error: createdProduct.error,
      });
    }
    const companyResponse = await addProductToCompany(companyId, createdProduct.data._id);
    if (!companyResponse.data || companyResponse.error) {
      return res.status(400).send({
        error: companyResponse.error,
      });
    }
    res.send(mapProduct(createdProduct.data.toObject()));
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
    res.send(mapProduct(updatedProduct.data.toObject()));
  } catch (error) {
    res.status(400).send({
      error,
    });
  }
};

export const deleteProductController = async (req: Request, res: Response) => {
  const { productId } = req.params;
  const { categoryId } = req.query;

  try {
    const categoryData = await deleteProductFromCategory(categoryId, productId);
    if (categoryData.error) {
      return res.status(400).send(categoryData.error);
    }

    const deletedProduct = await deleteProduct(productId);
    if (!deletedProduct.data || deletedProduct.error) {
      return res.status(400).send({
        error: deletedProduct.error,
      });
    }
    const allCategoriesResult = await removeProductsFromAllCategories(productId);
    if (allCategoriesResult.error) {
      return res.status(400).send({
        error: allCategoriesResult.error,
      });
    }
    res.send(deletedProduct.data);
  } catch (error) {
    res.status(400).send({
      error,
    });
  }
};

export const addProductToCategoryController = async (req: Request, res: Response) => {
  const { categoryId, productId } = req.params;
  try {
    const isProductExists = await checkCategoryHasProduct(categoryId, productId);
    if (isProductExists) {
      return res.status(400).send({
        error: "Product already exists",
      });
    }
    const newCategory = await addProductToCategory(categoryId, productId);
    if (!newCategory.data || newCategory.error) {
      return res.status(400).send({
        error: newCategory.error,
      });
    }
    res.send(newCategory.data);
  } catch (error) {
    res.status(400).send({
      error: (error as any).message || error,
    });
  }
};

export const removeProductFromCategoryController = async (req: Request, res: Response) => {
  const { categoryId, productId } = req.params;
  try {
    const newCategory = await deleteProductFromCategory(categoryId, productId);
    if (!newCategory.data || newCategory.error) {
      return res.status(400).send({
        error: newCategory.error,
      });
    }
    res.send(newCategory.data);
  } catch (error) {
    res.status(400).send({
      error: (error as any).message || error,
    });
  }
};
