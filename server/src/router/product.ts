import { Router } from "express";
import {
  createProductController, deleteProductController,
  getAllProductsController, updateProductController,
} from "../controllers/product";
import { ADMIN_PERMISSON_MIDDLEWARE } from "../middleware/permission";

const productRouter = Router();

productRouter.get(
  "/",
  getAllProductsController,
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
