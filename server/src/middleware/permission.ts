import { NextFunction, Request, Response } from "express";
import { checkCompanyHasMenu } from "../services/company";
import { getUser } from "../services/user";
import { checkMenuHasCategory } from "../services/menu";
import { checkCategoryHasProduct } from "../services/category";

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
  const { menuId, categoryId, productId } = req.params;
  const { company: companyId } = req.user;
  const isExists = await checkCompanyHasMenu({
    menuId,
    companyId,
  });
  if (!isExists) {
    return res.status(404).send({
      message: "[MENU_EXISTS_MIDDLEWARE] not allowed for this request",
    });
  }
  if (categoryId) {
    const isCategoryExists = await checkMenuHasCategory(menuId, categoryId);
    if (!isCategoryExists) {
      return res.status(404).send({
        message: "[MENU_EXISTS_MIDDLEWARE] not allowed for this request",
      });
    }
    if (productId) {
      const isProductExists = await checkCategoryHasProduct(categoryId, productId);
      if (!isProductExists) {
        return res.status(404).send({
          message: "[MENU_EXISTS_MIDDLEWARE] not allowed for this request",
        });
      }
    }
  }

  next();
};
