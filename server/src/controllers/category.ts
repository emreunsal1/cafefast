import { Request, Response } from "express";
import { createCategoryValidator } from "../models/category";
import { createCategory } from "../services/category";
import { checkCompanyHasMenu } from "../services/company";
import { addCategoryToMenu } from "../services/menu";

export const createCategoryController = async (req: Request, res: Response) => {
  const { company: companyId } = req.user;
  const { menuId } = req.params;

  try {
    const validatedPoruct = await createCategoryValidator.parseAsync(req.body);
    const isExists = await checkCompanyHasMenu(menuId, companyId);

    if (!isExists) {
      return res.status(404).send({
        message: "menu not exists",
      });
    }

    const createdCategory = await createCategory(validatedPoruct);
    if (!createdCategory.data || createdCategory.error) {
      return res.send(400).send({ message: "error when creating category", error: createdCategory.error });
    }

    const newMenu = await addCategoryToMenu({ _id: menuId }, createdCategory.data._id);
    if (!newMenu.data || newMenu.error) {
      return res.send(400).send({ message: "error when adding category to menu", error: newMenu.error });
    }

    res.status(201).send(newMenu);
  } catch (error) {
    res.status(400).send({
      error,
    });
  }
};
