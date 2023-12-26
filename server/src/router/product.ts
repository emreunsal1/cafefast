import { Router } from "express";
import {
  createProductController, deleteProductController,
  getAllProductsController, getProductDetailController,
  bulkUpdateProductsController, updateProductController,
} from "../controllers/product";
import { ADMIN_PERMISSON_MIDDLEWARE, COMPANY_MIDDLEWARE } from "../middleware/permission";
import { PRODUCT_EXISTS_IN_COMPANY_MIDDLEWARE } from "../middleware/menu";

const productRouter = Router();

productRouter.get(
  "/",
  getAllProductsController,
);

productRouter.put(
  "/bulk-update",
  COMPANY_MIDDLEWARE,
  bulkUpdateProductsController,
);

productRouter.get(
  "/:productId",
  COMPANY_MIDDLEWARE,
  PRODUCT_EXISTS_IN_COMPANY_MIDDLEWARE,
  getProductDetailController,
);

productRouter.post(
  "/",
  createProductController,
);

productRouter.delete(
  "/:productId",
  ADMIN_PERMISSON_MIDDLEWARE,
  COMPANY_MIDDLEWARE,
  PRODUCT_EXISTS_IN_COMPANY_MIDDLEWARE,
  deleteProductController,
);

productRouter.put(
  "/:productId",
  COMPANY_MIDDLEWARE,
  PRODUCT_EXISTS_IN_COMPANY_MIDDLEWARE,
  updateProductController,
);

export default productRouter;
