import { Request, Response } from "express";
import { createCategoryValidator } from "../models/category";
import { createCategory, deleteCategory } from "../services/category";
import { addCategoryToMenu, removeCategoryFromMenu } from "../services/menu";

export const createCategoryController = async (req: Request, res: Response) => {
  const { menuId } = req.params;

  try {
    const validatedPoruct = await createCategoryValidator.parseAsync(req.body);
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

export const deleteCategoryController = async (req: Request, res: Response) => {
  const { categoryId } = req.params;

  try {
    const categoryResult = await deleteCategory(categoryId);
    if (categoryResult.error || !categoryResult.data) {
      return res.send(400).send({
        message: "error when deleting category",
        error: categoryResult.error,
      });
    }

    const menuResult = await removeCategoryFromMenu(categoryId);
    if (!menuResult.data || menuResult.error) {
      return res.send(400).send({
        message: "error when deleting category from menu",
        error: menuResult.error,
      });
    }

    res.status(200).send();
    return;
  } catch (error) {
    res.status(400).send({
      error,
    });
  }
};
