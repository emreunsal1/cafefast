import { Request, Response } from "express";
import { createMenuVerifier, updateMenuVerifier } from "../models/menu";
import {
  addMenuToCompany, getCompany, removeMenuFromCompany,
} from "../services/company";
import {
  createMenu, deleteMenu, getMenus, updateMenu, getMenu,
} from "../services/menu";

export const getMenusController = async (req: Request, res: Response) => {
  const { company: companyId } = req.user;

  try {
    const companyData = await getCompany({ query: { _id: companyId }, populate: false });

    const { data: menus, error } = await getMenus(companyData.data!.menus);

    if (error || !menus) {
      return res.status(400).send({ error });
    }

    res.send(menus);
  } catch (error) {
    return res.status(400).send({ error });
  }
};

export const getMenuDetailController = async (req: Request, res: Response) => {
  const { menuId } = req.params;

  const menuData = await getMenu(menuId);

  res.send(menuData.data);
};

export const createMenuController = async (req: Request, res: Response) => {
  const { company } = req.user;
  try {
    const verifiedMenu = await createMenuVerifier.parseAsync(req.body);
    const createdMenu = await createMenu(verifiedMenu);

    if (!createdMenu.data || createdMenu.error) {
      return res.send({
        error: createdMenu.error,
      });
    }
    const newMenu = await addMenuToCompany({ _id: company }, createdMenu.data._id);
    if (!newMenu.data || newMenu.error) {
      return res.send({
        error: createdMenu.error,
      });
    }
    res.send(createdMenu.data);
    return;
  } catch (err) {
    res.status(400).send();
  }
};

export const deleteMenuController = async (req: Request, res: Response) => {
  const { menuId } = req.params;
  try {
    const { data: removeMenuData, error: removeMenuError } = await removeMenuFromCompany(menuId);
    if (!removeMenuData || removeMenuError) {
      return res.send({ error: removeMenuError });
    }
    const deletedMenu = await deleteMenu(menuId);
    // TODO: Delete all fields of menu (like: Products, Categories, etc.)

    if (deletedMenu.error || !deletedMenu.data) {
      res.send({
        error: deletedMenu.error,
      });
      return;
    }
    res.send(deletedMenu);
    return;
  } catch (err) {
    res.status(400).send();
  }
};

export const updateMenuController = async (req: Request, res: Response) => {
  const { menuId } = req.params;

  try {
    const verifiedMenuData = await updateMenuVerifier.parseAsync(req.body);
    const updatedMenu = await updateMenu({ query: { menuId }, data: verifiedMenuData });
    if (updatedMenu.error || !updatedMenu.data) {
      res.send({
        error: updatedMenu.error,
      });
      return;
    }
    res.send(updatedMenu.data);
    return;
  } catch (err) {
    res.status(400).send();
  }
};
