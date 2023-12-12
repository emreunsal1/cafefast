import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import logger from "../utils/logger";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandlerMiddleware = (error, req: Request, res: Response, _next: NextFunction) => {
  if (error instanceof ZodError) {
    const flattenErrors = error.flatten().fieldErrors;
    logger.warn({
      action: "VALIDATION_ERROR",
      path: req.originalUrl,
      url: req.url,
      errors: flattenErrors,
    });

    res.header("Content-Type", "application/json");
    return res.status(400).json({
      type: "VALIDATION_ERROR",
      fields: flattenErrors,
    });
  }

  logger.error({ action: "GLOBAL_ERROR", path: req.originalUrl, message: error.message });
  res.status(500).send({ stack: error, message: error.message, url: req.url });
};
