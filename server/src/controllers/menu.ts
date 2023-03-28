import { Request, Response } from "express";
import { createMenuVerifier, updateMenuVerifier } from "../models/menu";
import {
  addMenuToCompany, getCompany, removeMenuFromCompany,
} from "../services/company";
import {
  createMenu, deleteMenu, getMenus, updateMenu,
} from "../services/menu";

export const getMenusController = async (req: Request, res: Response) => {
  const { company: companyId } = req.user;

  const companyData = await getCompany({ query: { _id: companyId }, populate: false });

  if (!companyData.data || companyData.error) {
    return res.status(404).send({
      error: "Company not found",
    });
  }

  const { data: menus, error } = await getMenus(companyData.data.menus);

  if (error || !menus) {
    return res.status(400).send({ error });
  }

  res.send(menus);
};

export const createMenuController = async (req: Request, res: Response) => {
  const { company } = req.user;
  try {
    const verifiedMenu = await createMenuVerifier.parseAsync(req.body);
    const createdMenu = await createMenu(verifiedMenu);

    if (!createdMenu.data || createdMenu.error) {
      res.send({
        error: createdMenu.error,
      });
      return;
    }
    const { data } = await addMenuToCompany({ _id: company }, createdMenu.data._id);

    res.send(data.menus);
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
