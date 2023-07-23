import { Request, Response } from "express";
import {
  addCampaignToShopper,
  addCardToShopper,
  addProductToShopper,
  clearShopperBasket,
  createShopper,
  deleteCampaignFromShopper,
  deleteProductFromShopper,
  getShopper,
  getShopperBasketItems,
  updateCampaignCount,
  updateProductCount,
} from "../services/shopper";
import {
  createShopperVerifier, addNewItemVerifier, updateQuantityVerifier, shopperCardVerifier,
} from "../models/shopper";
import { getCompanyActiveMenu } from "../services/company";
import { checkMenuHasCampaign, checkMenuHasProduct } from "../utils/menu";
import { generateJwt } from "../utils/jwt";
import { mapShopperForJWT } from "../utils/mappers";
import { SHOPPER_AUTH_TOKEN_NAME, SHOPPER_NOT_FOUND_IN_DATABASE } from "../constants";
import { createBasketObject, mapBasket } from "../utils/basket";
import { createOrder } from "../services/order";

// TODO: Seperate add campaign and add product controllers.
export const addToBasketController = async (req: Request, res: Response) => {
  let { shopper } = req;
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
      const newBasketObject = createBasketObject({ product: verifiedShopper.product, campaign: verifiedShopper.campaign, companyId });

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
    const { data: shopperItemsData, error: shopperItemsError, errorCode: shopperItemsErrorCode } = await getShopperBasketItems(shopper._id);

    if (shopperItemsErrorCode === SHOPPER_NOT_FOUND_IN_DATABASE) {
      const newShopper = await createShopper();
      const mappedDataForJwt = mapShopperForJWT(newShopper.data);
      const newShopperJWT = await generateJwt(mappedDataForJwt);

      shopper = JSON.parse(JSON.stringify(mappedDataForJwt));
      res.cookie(SHOPPER_AUTH_TOKEN_NAME, newShopperJWT, { httpOnly: !!process.env.ENVIRONMENT });
    } else if (shopperItemsError || !shopperItemsData) {
      return res.status(500).send({
        message: "error when fetching user basket items",
        stack: shopperItemsError,
      });
    }

    if (companyId !== shopperItemsData?.companyId) {
      const { error: clearShopperError } = await clearShopperBasket(shopper._id, companyId);
      if (clearShopperError) {
        return res.status(500).send({
          message: "something wrong when clear shopper basket",
          stack: clearShopperError,
        });
      }
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

export const deleteProductInBasketController = async (req: Request, res: Response) => {
  try {
    const { shopper } = req;
    const { companyId, productId } = req.params;

    const companyActiveMenu = await getCompanyActiveMenu(companyId);

    const isProductExists = checkMenuHasProduct(companyActiveMenu.data, productId);
    if (!isProductExists) {
      return res.status(400).json({
        error: "Product not found in menu",
      });
    }
    const result = await deleteProductFromShopper({ shopperId: shopper._id, productId });
    if (result.error || !result.data) {
      return res.status(400).json({
        error: result.error,
      });
    }
    return res.send({ message: "deleted successfully" });
  } catch (error) {
    res.status(404).send({ message: "delete error", error });
  }
};

export const deleteCampaignInBasketController = async (req: Request, res: Response) => {
  try {
    const { shopper } = req;
    const { companyId, campaignId } = req.params;

    const companyActiveMenu = await getCompanyActiveMenu(companyId);

    const isCampaignExists = checkMenuHasCampaign(companyActiveMenu.data, campaignId);
    if (!isCampaignExists) {
      return res.status(404).json({
        error: "Campaign not found in menu",
      });
    }
    const result = await deleteCampaignFromShopper({ shopperId: shopper._id, campaignId });
    if (result.error || !result.data) {
      res.status(400).json({
        error: result.error,
      });
      return;
    }
    return res.send({ message: "deleted successfully" });
  } catch (error) {
    res.status(404).send({ message: "delete error", error });
  }
};

export const approveBasketController = async (req: Request, res: Response) => {
  try {
    const { shopper } = req;
    const { companyId } = req.params;
    // TODO: get cardId from user for saved cards
    const { price, card } = req.body;

    const shopperData = await getShopper(shopper._id, true);

    if (shopperData.error || !shopperData.data) {
      return res.status(404).send({
        message: "shopper not found",
        stack: shopperData.error,
      });
    }

    if (shopperData.data.basket?.company !== companyId) {
      return res.status(400).send({
        message: "i have got a one pencil",
        code: "CAN_NOT_APPROVE_OTHER_COMPANY",
      });
    }

    const { totalPrice, totalPriceText, totalPriceSymbolText } = mapBasket(shopperData.data);
    if (totalPrice !== price) {
      return res.status(400).send({
        message: "Price not matching with real data. Please refresh page and try again.",
        errorCode: "PRICE_NOT_MATCH_WITH_DATA",
        newPrices: {
          totalPrice,
          totalPriceText,
          totalPriceSymbolText,
        },
      });
    }

    const validatedCard = await shopperCardVerifier.parseAsync(card);
    const alreadyHaveCard = shopperData.data.cards.find((_card) => _card.cardNo === validatedCard.cardNo);
    let newCard;
    if (!alreadyHaveCard) {
      newCard = await addCardToShopper(shopper._id, validatedCard);
      if (newCard.error || !newCard.data) {
        return res.status(400).send({
          message: "card can not created",
          error: newCard.error,
        });
      }
    }
    if (alreadyHaveCard) {
      return res.send({
        message: "sent a cardId for saved card",
        errorCode: "CARD_ALREADY_SAVED_TO_SHOPPER",
      });
    }

    const newOrder = {
      company: companyId,
      shopper: shopperData.data._id,
      campaigns: shopperData.data.basket?.campaigns.map((campaign) => ({
        campaign: (campaign as any).campaign._id,
        count: (campaign as any).campaign.count,
      })),
      products: shopperData.data.basket?.products.map((product) => ({
        product: (product as any).product._id,
        count: (product as any).product.count,
      })),
      cardId: (newCard.data as any)._id,
    };

    const { data: createdOrder, error: createdOrderError } = await createOrder(newOrder);
    if (createdOrderError || !createdOrder) {
      return res.status(400).send({
        message: "order can not be created",
        stack: createdOrderError,
      });
    }

    const { data: clearShopperData, error: clearShopperError } = await clearShopperBasket(shopper._id, companyId);
    if (clearShopperError || !clearShopperData) {
      return res.status(400).send({
        message: "shopper basket can not be cleared",
        stack: clearShopperError,
      });
    }

    res.send(createdOrder);
  } catch (error) {
    res.send(error);
  }
};
