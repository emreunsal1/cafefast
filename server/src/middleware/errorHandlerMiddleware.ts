import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import logger from "../utils/logger";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandlerMiddleware = (error, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof ZodError) {
    logger.warn({ path: req.originalUrl, type: "VALIDATION_ERROR", errors: error.flatten() });
    res.header("Content-Type", "application/json");
    return res.status(400).json({
      type: "VALIDATION_ERROR",
      error: error.flatten().fieldErrors,
    });
  }

  logger.error({ path: req.originalUrl, message: error.message });
  res.status(500).send(error.message);
};
