import { NextFunction, Request, Response } from "express";
import { getCompanyActiveMenu } from "../services/company";
import { validateCompanyHasProducts } from "../utils/company";
import { getMenuWithId } from "../services/menu";

export const COMPANY_ACTIVE_MENU_MIDDLEWARE = async (req: Request, res: Response, next: NextFunction) => {
  const { companyId } = req.params;
  const companyActiveMenu = await getCompanyActiveMenu(companyId, true);

  if (companyActiveMenu.error || !companyActiveMenu.data) {
    return res.status(404).send({
      message: "[COMPANY_ACTIVE_MENU_MIDDLEWARE] Company has no active menu",
    });
  }
  res.locals.companyActiveMenu = companyActiveMenu.data;
  next();
};

export const MENU_EXISTS_MIDDLEWARE = async (req: Request, res: Response, next: NextFunction) => {
  const {
    menuId,
  } = req.params;
  const { companyInfo } = res.locals;
  const {
    menuId: menuIdFromBody,
    menuIds: menuIdsFromBody,
  } = req.body;

  const companyMenuIds = companyInfo.menus.map((_menu) => _menu._id.toString());
  try {
    if (menuId || menuIdFromBody) {
      const singleMenuId = menuId || menuIdFromBody;
      const isMenuExists = companyMenuIds.some((_menuId) => _menuId === singleMenuId);
      if (!isMenuExists) {
        return res.status(404).send({
          message: "[MENU_EXISTS_MIDDLEWARE] menu not found",
        });
      }
    }
    if (menuIdsFromBody) {
      const isAllMenusExistsOnCompany = menuIdsFromBody.every((_menuId) => companyMenuIds.includes(_menuId));
      if (!isAllMenusExistsOnCompany) {
        return res.status(404).send({
          message: "[MENU_EXISTS_MIDDLEWARE] menu not found",
        });
      }
    }
    const foundMenu = await getMenuWithId(menuId);

    res.locals.menuInfo = foundMenu;
    next();
  } catch (error) {
    return res.status(404).send({
      message: "[MENU_EXISTS_MIDDLEWARE] not allowed for this request",
      error,
    });
  }
};

export const PRODUCT_EXISTS_IN_COMPANY_MIDDLEWARE = async (req: Request, res: Response, next: NextFunction) => {
  const { companyInfo } = res.locals;

  if (req.body.products && req.params.productId && req.params.productId !== "multiple") {
    return res.status(400).send({
      message: "[BODY_PRODUCT_EXISTS_MIDDLEWARE] you can not send products and productId same time",
    });
  }

  try {
    if (req.body.products || req.params.productId) {
      const isValid = validateCompanyHasProducts(companyInfo, req.body.products || [req.params.productId]);
      if (!isValid) {
        return res.status(404).send({
          message: "[BODY_PRODUCT_EXISTS_MIDDLEWARE] products invalid",
        });
      }
    }

    next();
  } catch (error) {
    return res.status(404).send({
      message: "[BODY_PRODUCT_EXISTS_MIDDLEWARE] not allowed for this request",
      error,
    });
  }
};

export const CATEGORY_EXISTS_IN_MENU_MIDDLEWARE = async (req: Request, res: Response, next: NextFunction) => {
  const { menuInfo } = res.locals;
  const { categoryId } = req.params;

  try {
    const isCategoryExists = menuInfo.categories.some((category) => category._id.toString() === categoryId);
    if (!isCategoryExists) {
      return res.status(404).send({
        message: "[CATEGORY_EXISTS_MIDDLEWARE] category not found",
      });
    }
    next();
  } catch (error) {
    return res.status(404).send({
      message: "[CATEGORY_EXISTS_MIDDLEWARE] not allowed for this request",
      error,
    });
  }
};

export const CAMPAIGN_EXISTS_IN_MENU_MIDDLEWARE = async (req: Request, res: Response, next: NextFunction) => {
  const { menuInfo } = res.locals;
  const { campaignId } = req.params;

  try {
    const foundCampaign = menuInfo.campaigns.some((campaign) => campaign._id.toString() === campaignId);
    if (!foundCampaign) {
      return res.status(404).send({
        message: "[CAMPAIGN_EXISTS_MIDDLEWARE] campaign not found",
      });
    }
    next();
  } catch (error) {
    return res.status(404).send({
      message: "[BODY_PRODUCT_EXISTS_MIDDLEWARE] not allowed for this request",
      error,
    });
  }
};

export const CAMPAIGN_EXISTS_IN_COMPANY_MIDDLEWARE = async (req: Request, res: Response, next: NextFunction) => {
  const { companyInfo } = res.locals;
  const { campaignId } = req.params;
  const { campaigns } = req.body;
  const companyCampaignsAsString = companyInfo.campaigns.map((campaign) => campaign.toString());

  try {
    if (campaigns) {
      const isAllCampaignsExistsInCompany = campaigns.every((campaign) => companyCampaignsAsString.includes(campaign));
      if (!isAllCampaignsExistsInCompany) {
        return res.send({
          message: "[CAMPAIGN_EXISTS_MIDDLEWARE] campaign not found",
        });
      }
    }

    if (campaignId !== "multiple" && !campaigns?.length) {
      const foundCampaign = companyCampaignsAsString.find((campaign) => campaign === campaignId);
      if (!foundCampaign) {
        return res.status(404).send({
          message: "[CAMPAIGN_EXISTS_MIDDLEWARE] campaign not found",
        });
      }
    }
    next();
  } catch (error) {
    return res.status(404).send({
      message: "[BODY_PRODUCT_EXISTS_MIDDLEWARE] not allowed for this request",
      error,
    });
  }
};
