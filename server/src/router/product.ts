import { Router } from "express";
import {
  createProductController, deleteProductController,
  exportAllProductsController,
  getAllProductsController, updateProductController,
} from "../controllers/product";
import { ADMIN_PERMISSON_MIDDLEWARE } from "../middleware/permission";

const productRouter = Router();

productRouter.get(
  "/",
  getAllProductsController,
);

productRouter.get(
  "/export",
  exportAllProductsController,
);

productRouter.post(
  "/",
  createProductController,
);

productRouter.delete(
  "/:productId",
  ADMIN_PERMISSON_MIDDLEWARE,
  deleteProductController,
);

productRouter.put(
  "/:productId",
  updateProductController,
);

export default productRouter;
