import { Request, Response } from "express";
import { createProductValidator } from "../models/product";

export const createProductController = async (req: Request, res: Response) => {
  const { company } = req.user;
  const { menuId } = req.params;

  const validatedPoruct = await createProductValidator.parseAsync(req.body);
};
