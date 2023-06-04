import { Request, Response } from "express";
import { createShopper } from "../services/shopper";
import { IShopper, createShopperVerifier } from "../models/shopper";
import { getCompanyActiveMenu } from "../services/company";
import { checkMenuHasCampaign, checkMenuHasProduct } from "../utils/menu";
import { generateJwt } from "../utils/jwt";
import { mapShopperForJWT } from "../utils/mappers";
import { SHOPPER_AUTH_TOKEN_NAME } from "../constants";

export const addToBasketController = async (req: Request, res: Response) => {
  const { shopper } = req;
  const { companyId } = req.params;
  const { product, campaign } = req.body;
  const companyActiveMenu = await getCompanyActiveMenu(companyId);

  if (!companyActiveMenu.data || companyActiveMenu.error) {
    return res.status(404).json({
      error: "Company active menu not found",
      stack: companyActiveMenu.error,
    });
  }

  if (product) {
    const isProductExists = checkMenuHasProduct(companyActiveMenu.data, product);
    if (!isProductExists) {
      return res.status(400).json({
        error: "Product not found in menu",
      });
    }
  }

  if (campaign) {
    const isCampaignExists = checkMenuHasCampaign(companyActiveMenu.data, campaign);
    if (!isCampaignExists) {
      return res.status(404).json({
        error: "Campaign not found in menu",
      });
    }
  }

  if (!shopper) {
    const newBasket: Partial<IShopper["basket"]> = { products: [], campaigns: [] };
    if (product) {
      newBasket.products = [product];
    }
    if (campaign) {
      newBasket.campaigns = [campaign];
    }
    const verifiedShopper = await createShopperVerifier.parseAsync({ basket: newBasket });
    const newShopper = await createShopper(verifiedShopper);
    const newShopperJWT = await generateJwt(mapShopperForJWT(newShopper.data));
    return res.cookie(SHOPPER_AUTH_TOKEN_NAME, newShopperJWT, { httpOnly: !!process.env.ENVIRONMENT }).send({ token: newShopperJWT });
  }

  // TODO: Handle authenticated users.
  return res.status(400).send({ message: "not handled" });
};
