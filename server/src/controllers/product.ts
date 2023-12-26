import { Request, Response } from "express";
import {
  createProductValidator, updateBulkProductValidator, updateProductValidator,
} from "../models/product";
import {
  bulkUpdateProducts,
  createProduct, deleteMultipleProducts, deleteProduct, getAllProducts, getProductDetail, updateProduct,
} from "../services/product";
import {
  addProductToCategory, deleteMultipleProductsFromCategory, deleteProductFromCategory, removeProductsFromAllCategories,
} from "../services/category";
import { addProductToCompany } from "../services/company";
import { formatPrice, mapProduct } from "../utils/mappers";
import { validateCompanyHasProducts } from "../utils/company";
import { checkCategoryHasProduct } from "../utils/menu";
import logger from "../utils/logger";

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

export const bulkUpdateProductsController = async (req: Request, res: Response, next) => {
  const { companyInfo } = res.locals;
  const products = req.body;

  try {
    await updateBulkProductValidator.parseAsync(products);
    const priceMappedProducts = products.map((_product) => ({
      ..._product,
      price: formatPrice(_product.price),
    }));
    const productIds = products.map((product) => product._id);
    const isValid = validateCompanyHasProducts(
      companyInfo,
      productIds,
    );

    if (!isValid) {
      logger.error({ action: "UPDATE_BULK_PRODUCT_INVALID_PRODUCT", productIds, message: "products not owned by company" });
      return res.status(400).send({
        message: "error",
      });
    }

    const result = await bulkUpdateProducts(priceMappedProducts);
    if (result.data?.nMatched !== products.length) {
      logger.error({
        action: "UPDATE_UPDATE_WRITE",
        updatedProducts: result.data?.insertedIds,
        sentProducts: productIds,
      });
      return res.status(400).send({
        message: "some products not updated",
      });
    }

    res.send({ message: "Products successfully updated" });
  } catch (error) {
    next(error);
  }
};

export const createProductController = async (req: Request, res: Response, next) => {
  const { company: companyId } = req.user;
  try {
    const validatedPoruct = await createProductValidator.parseAsync(req.body);
    const priceMappedProducts = {
      ...JSON.parse(JSON.stringify(validatedPoruct)),
      price: formatPrice(validatedPoruct.price),
    };

    const createdProduct = await createProduct(priceMappedProducts);
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
    const priceMappedProducts = {
      ...JSON.parse(JSON.stringify(validatedProduct)),
      price: formatPrice(validatedProduct.price),
    };

    const updatedProduct = await updateProduct(productId, priceMappedProducts);
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
  const { products } = req.body;

  try {
    if (products?.length && productId && productId !== "multiple") {
      res.status(400).send({
        message: "you can not send products and productId same time",
      });
    }

    if (Array.isArray(products) && productId === "multiple") {
      await deleteMultipleProductsFromCategory(categoryId, products);
      return res.send({ message: "successfully delete products", products });
    }
    const newCategory = await deleteProductFromCategory(categoryId, productId);
    if (!newCategory.data || newCategory.error) {
      return res.status(400).send({
        error: newCategory.error,
      });
    }
    return res.send(newCategory.data);
  } catch (error) {
    next(error);
  }
};
