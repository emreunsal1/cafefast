import { NextFunction, Request, Response } from "express";
import { checkCompanyHasMenu } from "../services/company";
import { getUser } from "../services/user";
import { getMenuWithId } from "../services/menu";
import { validateCompanyHasProducts } from "../utils/company";

export const ADMIN_PERMISSON_MIDDLEWARE = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.user;
  const { data } = await getUser({ query: { email } });

  if (data?.role !== 0) {
    return res.status(401).send({
      message: "[ADMIN_PERMISSON_MIDDLEWARE] not allowed for this request",
    });
  }
  next();
};

export const MENU_EXISTS_MIDDLEWARE = async (req: Request, res: Response, next: NextFunction) => {
  const {
    menuId, categoryId, campaignId, productId,
  } = req.params;
  const { company: companyId } = req.user;
  try {
    const foundCompany = await checkCompanyHasMenu({
      menuId,
      companyId,
    });
    if (!foundCompany) {
      return res.status(404).send({
        message: "[MENU_EXISTS_MIDDLEWARE] menu not found",
      });
    }
    if (req.body.products || productId) {
      const isValid = await validateCompanyHasProducts(foundCompany, req.body.products || [productId]);
      if (!isValid) {
        return res.status(404).send({
          message: "[MENU_EXISTS_MIDDLEWARE] products invalid",
        });
      }
    }
    const foundMenu = await getMenuWithId(menuId);
    if (!foundMenu) {
      return res.status(404).send({
        message: "[MENU_EXISTS_MIDDLEWARE] menu not found v2 :D",
      });
    }
    if (categoryId) {
      const foundCategory = foundMenu.categories.find((category) => {
        const condition = category._id.toString() === categoryId;
        return condition;
      });
      if (!foundCategory) {
        return res.status(404).send({
          message: "[MENU_EXISTS_MIDDLEWARE] category not found",
        });
      }
      if (productId && req.method !== "POST") {
        const foundProduct = (foundCategory as any).products.find((product) => product.toString() === productId);
        if (!foundProduct) {
          return res.status(404).send({
            message: "[MENU_EXISTS_MIDDLEWARE] product not found",
          });
        }
      }
    }
    if (campaignId) {
      const foundCampaign = foundMenu.campaigns.find((campaign) => campaign._id.toString() === campaignId);
      if (!foundCampaign) {
        return res.status(404).send({
          message: "[MENU_EXISTS_MIDDLEWARE] campaign not found",
        });
      }
    }
    next();
  } catch (error) {
    return res.status(404).send({
      message: "[MENU_EXISTS_MIDDLEWARE] not allowed for this request",
      error,
    });
  }
};
