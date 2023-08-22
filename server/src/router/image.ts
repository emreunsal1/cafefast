import { Router } from "express";
import multer from "multer";
import { config } from "dotenv";
import { getImageController, uploadImageController } from "../controllers/image";
import { AUTH_REQUIRED_MIDDLEWARE } from "../middleware/jwt";
import { UPLOAD_LIMIT } from "../constants";
import logger from "../utils/logger";

config();

const route = Router();

const uploadMiddleware = multer({
  fileFilter(req, file, cb) {
    if (/image/.test(file.mimetype)) {
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

route.post("/", AUTH_REQUIRED_MIDDLEWARE, uploadMiddleware.single("image"), uploadImageController);
route.get("/:filename", getImageController);

export default route;
