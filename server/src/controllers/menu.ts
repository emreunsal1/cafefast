import { Request, Response } from "express";
import { createMenuVerifier } from "../models/menu";
import { addMenuToCompany, getCompany } from "../services/company";
import { createMenu, deleteMenu } from "../services/menu";

export const getMenusController = async (req: Request, res: Response) => {
  const { company } = req.user;

  const { data: foundCompany, error } = await getCompany({ query: { _id: company }, populate: true });

  if (!foundCompany || error) {
    return res.status(400).send({ error });
  }
  res.send(foundCompany.menus);
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
  const { id } = req.params;
  const { company: companyId } = req.user;

  try {
    const deletedMenu = await deleteMenu(id, companyId);

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
