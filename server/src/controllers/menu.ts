import { Request, Response } from "express";
import { createMenuVerifier } from "../models/menu";
import { addMenuToCompany } from "../services/company";
import { createMenu, deleteMenu, getMenus } from "../services/menu";

export const getMenusController = async (req: Request, res: Response) => {
  const { company: companyId } = req.user;

  const { data: foundCompany, error } = await getMenus(companyId);

  if (!foundCompany || error) {
    return res.status(400).send({ error });
  }

  res.send(foundCompany);
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
  const { company: companyId } = req.user;

  try {
    const deletedMenu = await deleteMenu(menuId, companyId);

    if (!deletedMenu.data || deletedMenu.error) {
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
