import { Request, Response } from "express";
import {
  addCampaignToShopper,
  addProductToShopper,
  createShopper,
  deleteCampaing,
  deleteProduct,
  getShopper,
  getShopperBasketItems,
  updateCampaignCount,
  updateProductCount,
} from "../services/shopper";
import { createShopperVerifier, addNewItemVerifier, updateQuantityVerifier } from "../models/shopper";
import { getCompanyActiveMenu } from "../services/company";
import { checkMenuHasCampaign, checkMenuHasProduct } from "../utils/menu";
import { generateJwt } from "../utils/jwt";
import { mapShopperForJWT } from "../utils/mappers";
import { SHOPPER_AUTH_TOKEN_NAME } from "../constants";
import { createBasketObject, mapBasket } from "../utils/basket";

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

  try {
    if (!shopper) {
      const verifiedShopper = await createShopperVerifier.parseAsync({ product, campaign });
      if (!verifiedShopper.campaign && !verifiedShopper.product) {
        return res.status(400).send({ message: "at least one product or campaign should be in body" });
      }
      const newBasketObject = createBasketObject({ product: verifiedShopper.product, campaign: verifiedShopper.campaign });

      const newShopper = await createShopper({
        basket: newBasketObject,
      });

      const newShopperJWT = await generateJwt(mapShopperForJWT(newShopper.data));
      return res.cookie(SHOPPER_AUTH_TOKEN_NAME, newShopperJWT, { httpOnly: !!process.env.ENVIRONMENT }).send({ token: newShopperJWT });
    }

    const newItemObject = await addNewItemVerifier.parseAsync(req.body);
    if (!newItemObject.campaign && !newItemObject.product) {
      return res.status(400).send({ message: "at least one product or campaign should be in body" });
    }
    const { data: shopperItemsData, error: shopperItemsError } = await getShopperBasketItems(shopper._id);
    if (!shopperItemsData || shopperItemsError) {
      return res.status(500).send({
        message: "error when fetching user basket items",
        stack: shopperItemsError,
      });
    }

    if (newItemObject.product) {
      if (shopperItemsData?.products?.includes(newItemObject.product)) {
        return res.status(400).send({
          message: "You can not add same items again",
          field: "product",
        });
      }
      await addProductToShopper(shopper._id, newItemObject.product);
    }
    if (newItemObject.campaign) {
      if (shopperItemsData?.campaigns?.includes(newItemObject.campaign)) {
        return res.status(400).send({
          message: "You can not add same items again",
          field: "campaign",
        });
      }
      await addCampaignToShopper(shopper._id, newItemObject.campaign);
    }
  } catch (err) {
    res.status(500).send({
      message: "error occured",
      stack: err,
    });
  }

  return res.status(201).send({ message: "items added" });
};

export const getBasketController = async (req: Request, res: Response) => {
  const { shopper } = req;
  if (shopper === undefined) {
    return res.status(404).send({
      message: "basket is null",
      stack: undefined,
    });
  }
  const { data, error } = await getShopper(shopper._id);

  if (!data || error) {
    return res.status(404).send({
      message: "Shopper not found",
      stack: error,
    });
  }

  res.send(mapBasket(data));
};

export const updateQuantityController = async (req: Request, res: Response) => {
  const { shopper } = req;

  try {
    const { campaign, product, quantity } = await updateQuantityVerifier.parseAsync(req.body);

    if ((!campaign && !product) || (!!campaign && !!product)) {
      res.status(400).send({
        message: "only one product or campaign id should be sent",
      });
    }

    if (product) {
      const { data, error } = await updateProductCount({
        shopperId: shopper._id,
        productId: product,
        quantity,
      });
      if (!data || error) {
        return res.status(404).send({
          message: "Product can not be updated",
          stack: error,
        });
      }
    }

    if (campaign) {
      const { data, error } = await updateCampaignCount({
        shopperId: shopper._id,
        campaignId: campaign,
        quantity,
      });
      if (!data || error) {
        return res.status(404).send({
          message: "Campaign can not be updated",
          stack: error,
        });
      }
    }

    return res.status(200).send({
      message: "item updated successfully",
    });
  } catch (err) {
    res.status(500).send({
      message: "error occured",
      stack: err,
    });
  }
};

export const deleteProductInBasket = async (req: Request, res: Response) => {
  try {
    const { shopper } = req;
    const { companyId } = req.params;
    const { product, campaign } = req.body;
    const { data, error } = await getShopper(shopper._id);

    const companyActiveMenu = await getCompanyActiveMenu(companyId);
    const basketData = mapBasket(data);

    if (shopper === undefined) {
      return res.status(404).send({
        message: "you aren't shopper",
        stack: undefined,
      });
    }
    if (!basketData.products.length) {
      return res.status(404).send({
        message: "You do not have this product in your cart",
        stack: undefined,
      });
    }
    if (product) {
      const isProductExists = checkMenuHasProduct(companyActiveMenu.data, product);
      if (!isProductExists) {
        return res.status(400).json({
          error: "Product not found in menu",
        });
      }
      const result = await deleteProduct({ shopperId: shopper._id, productId: product });
      if (result) {
        return res.send("success");
      }
      return res.status(400).json({
        error: "product could not be deleted",
      });
    }
    if (campaign) {
      const isCampaignExists = checkMenuHasCampaign(companyActiveMenu.data, campaign);
      if (!isCampaignExists) {
        return res.status(404).json({
          error: "Campaign not found in menu",
        });
      }
      const result = await deleteCampaing({ shopperId: shopper._id, campaignId: campaign });
      if (result) {
        return res.send("success");
      }
      return res.status(400).json({
        error: "campaign could not be deleted",
      });
    }
  } catch (err) {
    res.status(404).send({ msg: "delete error", err });
  }
};
