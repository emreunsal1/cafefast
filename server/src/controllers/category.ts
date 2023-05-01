import { Request, Response } from "express";
import { createCategoryValidator, updateCategoryValidator } from "../models/category";
import {
  createCategory, deleteCategory, updateCategory,
} from "../services/category";
import { addCategoryToMenu, getMenuWithId, removeCategoryFromMenu } from "../services/menu";

export const createCategoryController = async (req: Request, res: Response) => {
  const { menuId } = req.params;
  const { name } = req.body;

  try {
    const validatedCategory = await createCategoryValidator.parseAsync(req.body);
    const menu = await getMenuWithId(menuId);
    const isExistCategory = menu?.categories.some((category:any) => name.toLowerCase() === category.name.toLowerCase());
    if (isExistCategory) {
      return res.status(400).send({ error: "CATEGORY_NAME_MUST_BE_UNIQUE" });
    }

    const createdCategory = await createCategory(validatedCategory);

    if (!createdCategory.data || createdCategory.error) {
      return res.send(400).send({ message: "error when creating category", error: createdCategory.error });
    }

    const newMenu = await addCategoryToMenu({ _id: menuId }, createdCategory.data._id);
    if (!newMenu.data || newMenu.error) {
      return res.send(400).send({ error: newMenu.error });
    }

    res.status(201).send(createdCategory.data);
  } catch (error) {
    res.status(400).send({
      error,
    });
  }
};

export const updateCategoryController = async (req: Request, res: Response) => {
  const { categoryId, menuId } = req.params;
  const { name } = req.body;
  try {
    const validatedCategory = await updateCategoryValidator.parseAsync(req.body);
    const menu = await getMenuWithId(menuId);
    const isExistCategory = menu?.categories.some((category:any) => name.toLowerCase() === category.name.toLowerCase());
    if (isExistCategory) {
      return res.status(400).send({ error: "CATEGORY_NAME_MUST_BE_UNIQUE" });
    }

    const newCategory = await updateCategory(categoryId, validatedCategory);
    if (!newCategory.data || newCategory.error) {
      return res.send(400).send({ error: newCategory.error });
    }

    res.send(newCategory);
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
