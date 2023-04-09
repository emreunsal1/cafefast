import { Router } from "express";
import { AUTH_REQUIRED_MIDDLEWARE } from "../middleware/jwt";
import {
  createProductController, deleteProductController,
  getAllProductsController, updateProductController,
} from "../controllers/product";
import { ADMIN_PERMISSON_MIDDLEWARE } from "../middleware/permission";

const productRouter = Router();

productRouter.get(
  "/",
  AUTH_REQUIRED_MIDDLEWARE,
  getAllProductsController,
);

productRouter.post(
  "/",
  AUTH_REQUIRED_MIDDLEWARE,
  createProductController,
);

productRouter.delete(
  "/:productId",
  AUTH_REQUIRED_MIDDLEWARE,
  ADMIN_PERMISSON_MIDDLEWARE,
  deleteProductController,
);

productRouter.put(
  "/:productId",
  AUTH_REQUIRED_MIDDLEWARE,
  updateProductController,
);

export default productRouter;
