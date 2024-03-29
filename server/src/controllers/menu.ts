import { Request, Response } from "express";
import { createMenuVerifier, updateMenuVerifier } from "../models/menu";
import {
  addMenuToCompany, getCompany, removeMenuFromCompany, removeMultipleMenusFromCompany,
} from "../services/company";
import {
  createMenu, deleteMenu, getMenus, updateMenu, getMenu, getMenuWithId,
  addCampaignToMenu, removeCampaignFromMenu, getMenusWithIds, deleteMultipleMenus,
} from "../services/menu";
import { mapMenu } from "../utils/mappers";
import { deleteCategoriesWithIds } from "../services/category";

export const getMenusController = async (req: Request, res: Response, next) => {
  const { company: companyId } = req.user;

  try {
    const companyData = await getCompany({ query: { _id: companyId }, populate: false });

    const { data: menus, error } = await getMenus(companyData.data!.menus);

    if (error || !menus) {
      return res.status(400).send({ error });
    }

    res.send(menus);
  } catch (error) {
    next(error);
  }
};

export const getMenuDetailController = async (req: Request, res: Response) => {
  const { menuId } = req.params;

  const menuData = await getMenu(menuId);

  res.send(mapMenu(menuData.data?.toObject()));
};

export const createMenuController = async (req: Request, res: Response, next) => {
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
  } catch (err) {
    next(err);
  }
};

export const deleteMenuController = async (req: Request, res: Response, next) => {
  const { company } = req.user;
  const { menuId, menuIds } = req.body;
  try {
    if (menuId && menuIds?.length) {
      return res.status(400).send({
        message: "menuId and menuIds body params can not be used at the same time",
      });
    }
    if (menuId) {
      const { data: removeMenuData, error: removeMenuError } = await removeMenuFromCompany(menuId);
      if (!removeMenuData || removeMenuError) {
        return res.send({ error: removeMenuError });
      }
      const menu = await getMenuWithId(menuId, false);
      const deletedMenu = await deleteMenu(menuId);
      await deleteCategoriesWithIds(menu?.categories);

      if (deletedMenu.error || !deletedMenu.data) {
        return res.send({
          error: deletedMenu.error,
        });
      }
    }

    if (menuIds.length) {
      const menus = await getMenusWithIds(menuIds);
      if (menuIds.length !== menus.length) {
        return res.status(400).send({
          message: "sent menus not found",
          foundMenus: menus.map((_menu) => _menu._id),
        });
      }
      const allCategoryIds = menus.map((_menu) => _menu.categories).flat();
      const deleteMenusResult = await deleteMultipleMenus(menuIds);

      if (deleteMenusResult.deletedCount !== menuIds.length) {
        return res.status(400).send({
          message: "sent menus can not be deleted",
          deletedCount: deleteMenusResult.deletedCount,
        });
      }
      await deleteCategoriesWithIds(allCategoryIds);
      await removeMultipleMenusFromCompany(company, menuIds);
    }
    res.send({
      message: "deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

export const updateMenuController = async (req: Request, res: Response, next) => {
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
  } catch (err) {
    next(err);
  }
};

export const addCampaignToMenuController = async (req: Request, res: Response, next) => {
  const { menuId, campaignId } = req.params;
  try {
    const foundMenu = await getMenuWithId(menuId, false);

    const isCampaignExists = foundMenu?.campaigns.some((_campaignId) => _campaignId.toString() === campaignId);
    if (isCampaignExists) {
      return res.status(400).send({ error: "Campaign already exists in menu" });
    }

    const menuResponse = await addCampaignToMenu({ campaignId, menuId });
    if (!menuResponse.data || menuResponse.error) {
      return res.status(400).send(menuResponse.error);
    }

    res.status(201).send(menuResponse.data);
  } catch (error) {
    next(error);
  }
};

export const removeCampaignFromMenuController = async (req: Request, res: Response, next) => {
  const { menuId, campaignId } = req.params;
  try {
    const menuResponse = await removeCampaignFromMenu(menuId, campaignId);
    if (!menuResponse.data || menuResponse.error) {
      return res.status(400).send(menuResponse.error);
    }

    res.status(200).send(menuResponse.data);
  } catch (error) {
    next(error);
  }
};
