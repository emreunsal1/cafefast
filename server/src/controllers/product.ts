import { Request, Response } from "express";
import xl from "excel4node";
import stream from "stream";
import readXlsxFile from "read-excel-file/node";
import { bulkUpdateCreateValidator, createProductValidator, updateProductValidator } from "../models/product";
import {
  bulkCreateProducts,
  bulkUpdateProducts,
  createProduct, deleteProduct, getAllProducts, updateProduct,
} from "../services/product";
import {
  addProductToCategory, checkCategoryHasProduct, deleteProductFromCategory, removeProductsFromAllCategories,
} from "../services/category";
import { addProductToCompany, addProductsToCompany, getCompany } from "../services/company";
import { mapProduct } from "../utils/mappers";
import { createSheetHeader, fillProductsToExcel, getProductsFromExcel } from "../utils/excel";
import { validateCompanyHasProducts } from "../utils/company";

export const getAllProductsController = async (req: Request, res: Response, next) => {
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
    next(error);
  }
};

export const exportAllProductsController = async (req: Request, res: Response, next) => {
  const { company } = req.user;
  try {
    const productsResponse = await getAllProducts(company);
    if (!productsResponse.data || productsResponse.error) {
      return res.status(400).send({
        error: productsResponse.error,
      });
    }

    const workbook = new xl.Workbook({
      defaultFont: {
        size: 16,
      },
    });
    const sheet = workbook.addWorksheet("Ürünler");
    createSheetHeader(workbook, sheet);
    fillProductsToExcel(productsResponse.data.products, sheet);

    const buffer = await workbook.writeToBuffer();
    const fileContents = Buffer.from(buffer, "base64");
    const readStream = new stream.PassThrough();
    readStream.end(fileContents);
    res.set("Content-disposition", "attachment; filename=Ürünler.xlsx");
    res.set("Content-Type", "text/plain");
    readStream.pipe(res);
  } catch (error) {
    next(error);
  }
};

export const importProductsController = async (req: Request, res: Response, next) => {
  const { company } = req.user;
  const { file } = req;
  try {
    const rows = await readXlsxFile(file.buffer);
    const products = getProductsFromExcel(rows);

    if (products.productsNeedUpdate.length > 0) {
      await bulkUpdateCreateValidator.array().parseAsync(products.productsNeedUpdate);
      const companyData = await getCompany(company);
      const isValid = validateCompanyHasProducts(
        companyData.data,
        products.productsNeedUpdate.map((product) => product._id),
      );
      if (!isValid) {
        return res.status(400).send({
          message: "product ids are not valid",
        });
      }

      const result = await bulkUpdateProducts(products.productsNeedUpdate);
      if (result.data?.nMatched !== products.productsNeedUpdate.length) {
        return res.status(400).send({
          message: "error when updating existing products",
        });
      }
    }

    if (products.newProducts.length > 0) {
      const validatedProducts = await bulkUpdateCreateValidator.array().parseAsync(products.newProducts);
      const createProductsResult = await bulkCreateProducts(validatedProducts);
      if (createProductsResult.error || !createProductsResult.data) {
        return res.status(400).send(createProductsResult.error);
      }

      const newProductIds = createProductsResult.data?.map((newProduct) => newProduct._id);
      const companyProductsResult = await addProductsToCompany(company, newProductIds);
      if (companyProductsResult.error || !companyProductsResult.data) {
        return res.status(400).send(companyProductsResult.error);
      }
    }

    res.send({ message: "Products successfully imported" });
  } catch (error) {
    next(error);
  }
};

export const createProductController = async (req: Request, res: Response, next) => {
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
    next(error);
  }
};

export const updateProductController = async (req: Request, res: Response, next) => {
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
    next(error);
  }
};

export const deleteProductController = async (req: Request, res: Response, next) => {
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
    next(error);
  }
};

export const addProductToCategoryController = async (req: Request, res: Response, next) => {
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
    next(error);
  }
};

export const removeProductFromCategoryController = async (req: Request, res: Response, next) => {
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
    next(error);
  }
};
