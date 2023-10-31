import { Router } from "express";
import multer from "multer";
import {
  createProductController, deleteProductController,
  exportAllProductsController,
  getAllProductsController, importProductsController, updateProductController,
} from "../controllers/product";
import { ADMIN_PERMISSON_MIDDLEWARE, COMPANY_MIDDLEWARE } from "../middleware/permission";
import { PRODUCT_EXISTS_IN_COMPANY_MIDDLEWARE } from "../middleware/menu";
import logger from "../utils/logger";
import { UPLOAD_LIMIT } from "../constants";

const productRouter = Router();

const uploadMiddleware = multer({
  fileFilter(req, file, cb) {
    if (/officedocument/.test(file.mimetype)) {
      return cb(null, true);
    }
    logger.warn({
      path: "UPLOAD", action: "UPLOAD_FILE_FILTER_ERROR", message: "wrong mimetype detected", completeFile: file,
    });
    cb(null, false);
  },
  limits: {
    fileSize: process.env.UPLOAD_LIMIT || UPLOAD_LIMIT,
  },
});

productRouter.get(
  "/",
  getAllProductsController,
);

productRouter.get(
  "/export",
  exportAllProductsController,
);

productRouter.post(
  "/import",
  uploadMiddleware.single("products"),
  COMPANY_MIDDLEWARE,
  importProductsController,
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
