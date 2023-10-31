import { Request, Response } from "express";
import xl from "excel4node";
import stream from "stream";
import readXlsxFile from "read-excel-file/node";
import { bulkUpdateCreateValidator, createProductValidator, updateProductValidator } from "../models/product";
import {
  bulkCreateProducts,
  bulkUpdateProducts,
  createProduct, deleteMultipleProducts, deleteProduct, getAllProducts, getProductDetail, updateProduct,
} from "../services/product";
import {
  addProductToCategory, deleteProductFromCategory, removeProductsFromAllCategories,
} from "../services/category";
import { addProductToCompany, addProductsToCompany } from "../services/company";
import { mapProduct } from "../utils/mappers";
import { createSheetHeader, fillProductsToExcel, getProductsFromExcel } from "../utils/excel";
import { validateCompanyHasProducts } from "../utils/company";
import { checkCategoryHasProduct } from "../utils/menu";

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

export const getProductDetailController = async (req: Request, res: Response, next) => {
  try {
    const productData = await getProductDetail(req.params.productId);

    if (!productData) {
      res.status(400).send(productData);
    }
    res.send(mapProduct(productData?.toObject()));
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
  const { companyInfo } = res.locals;
  try {
    const rows = await readXlsxFile(file.buffer);
    const products = getProductsFromExcel(rows);

    if (products.productsNeedUpdate.length > 0) {
      await bulkUpdateCreateValidator.array().parseAsync(products.productsNeedUpdate);
      const isValid = validateCompanyHasProducts(
        companyInfo,
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
  const { products } = req.body;

  if (productId !== "multiple" && products) {
    return res.status(400).send({
      error: "You can't send productId and req.body.products in same time",
    });
  }

  try {
    if (products) {
      const promises = products.map((_productId) => removeProductsFromAllCategories(_productId));
      const responses = await Promise.all(promises);
      const hasErrorOnResponses = responses.find((response) => !response.data || response.error);
      if (hasErrorOnResponses) {
        return res.status(400).send({
          error: hasErrorOnResponses.error,
        });
      }
      await deleteMultipleProducts(products);
    }

    if (productId !== "multiple") {
      const allCategoriesResult = await removeProductsFromAllCategories(productId);
      if (allCategoriesResult.error) {
        return res.status(400).send({
          error: allCategoriesResult.error,
        });
      }
      const deletedProduct = await deleteProduct(productId);
      if (!deletedProduct.data || deletedProduct.error) {
        return res.status(400).send({
          error: deletedProduct.error,
        });
      }
    }

    res.send({ message: "deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const addProductToCategoryController = async (req: Request, res: Response, next) => {
  const { categoryId, productId } = req.params;
  const { menuInfo } = res.locals;
  try {
    const isProductExists = await checkCategoryHasProduct(menuInfo, categoryId, productId);
    if (isProductExists) {
      return res.status(400).send({
        error: "Product already exists in category",
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
