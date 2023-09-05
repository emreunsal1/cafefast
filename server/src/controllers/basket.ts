import { Request, Response } from "express";
import {
  addCampaignToShopper,
  addCardToShopper,
  addProductToShopper,
  clearShopperBasket,
  deleteCampaignFromShopper,
  deleteProductFromShopper,
  getShopper,
  setLastOtpDateToShopper,
  setPhoneNumberToShopper,
  updateCampaignCount,
  updateProductCount,
} from "../services/shopper";
import {
  updateQuantityVerifier, shopperCardVerifier, updateShopperVerifier,
} from "../models/shopper";
import { checkCompanyHasDesk, getCompanyActiveMenu } from "../services/company";
import { checkMenuHasCampaign, checkMenuHasProduct } from "../utils/menu";
import { mapSavedCards } from "../utils/mappers";
import {
  HOUR_AS_MS, OTP_EXPIRE_IN_SECONDS, SAVED_CARD_NOT_FOUND_IN_USER, SHOPPER_NOT_FOUND_IN_DATABASE,
} from "../constants";
import { mapBasket } from "../utils/basket";
import { createOrder } from "../services/order";
import { getIO } from "../utils/socket";
import { getRedis } from "../services/redis";

export const addProductToBasketController = async (req: Request, res: Response) => {
  const { shopper } = req;
  const { productId } = req.params;
  const { shopperData } = res.locals;

  const isProductExistsOnMenu = checkMenuHasProduct(res.locals.companyActiveMenu, productId);
  if (!isProductExistsOnMenu) {
    return res.status(400).json({
      error: "Product not found in company active menu",
    });
  }

  const shopperHasProductAlready = shopperData.basket.products.some((_product) => String(_product.product) === productId);
  if (shopperHasProductAlready) {
    return res.status(400).send({
      message: "You can not add same product again",
    });
  }

  const newShopper = await addProductToShopper(shopper._id, productId);
  if (newShopper.error || !newShopper.data) {
    return res.status(400).send({
      error: newShopper.error,
    });
  }

  res.status(201).send(newShopper.data);
};

export const addCampaignToBasketController = async (req: Request, res: Response) => {
  const { shopper } = req;
  const { campaignId } = req.params;
  const { shopperData } = res.locals;

  const isCampaignExistsInActiveMenu = checkMenuHasCampaign(res.locals.companyActiveMenu, campaignId);
  if (!isCampaignExistsInActiveMenu) {
    return res.status(400).json({
      error: "Campaign not found in company active menu",
    });
  }

  const shopperHasCampaignAlready = shopperData.basket.campaigns.some((_campaign) => String(_campaign.campaign) === campaignId);
  if (shopperHasCampaignAlready) {
    return res.status(400).send({
      message: "You can not add same campaign again",
    });
  }

  const newShopper = await addCampaignToShopper(shopper._id, campaignId);
  if (newShopper.error || !newShopper.data) {
    return res.status(400).send({
      error: newShopper.error,
    });
  }

  res.status(201).send(newShopper.data);
};

export const getBasketController = async (req: Request, res: Response) => {
  const { shopper } = req;
  const { data, error } = await getShopper(shopper._id);

  if (!data || error) {
    return res.status(401).send({
      message: "Please add item to basket, unauthorized user or deleted user detected.",
      stack: error,
    });
  }

  res.send(mapBasket(data.toObject()));
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

export const getShopperSavedCardController = async (req: Request, res: Response) => {
  const { shopper } = req;

  const shopperData = await getShopper(shopper._id, true);

  if (shopperData.data?.phone) {
    return res.status(400).send({
      message: "Should save phone number for getting saved cards",
      error: SAVED_CARD_NOT_FOUND_IN_USER,
    });
  }

  res.send(mapSavedCards(shopperData.data?.cards));
};

export const sendOtpController = async (req: Request, res: Response) => {
  const { phoneNumber } = req.body;
  const { shopperData } = res.locals;

  try {
    const { phone } = await updateShopperVerifier.parseAsync({ phone: phoneNumber });

    const redis = getRedis();
    const redisKey = `${shopperData._id}-${phone}`;
    await redis.set(redisKey, "00000");
    await redis.expire(redisKey, OTP_EXPIRE_IN_SECONDS);
    res.send({ success: true });
  } catch (error) {
    res.send({
      error: (error as any).message || error,
      message: "otp not sent",
    });
  }
};

export const approveBasketController = async (req: Request, res: Response) => {
  try {
    const { shopper } = req;
    const { companyId } = req.params;
    const {
      price, card, desk,
      phoneNumber, otp, savedCardId,
    } = req.body;

    const shopperData = await getShopper(shopper._id, true);
    const hasDesk = await checkCompanyHasDesk({ companyId, desk });

    if (!hasDesk) {
      return res.status(404).send({
        message: "sent desk not found",
      });
    }

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

    // If user should verify OTP
    if (!shopperData.data.lastOtpDate || (Date.now() - shopperData.data.lastOtpDate) > (12 * HOUR_AS_MS)) {
      let shopperCurrentPhone = shopperData.data.phone;
      if (!shopperCurrentPhone) {
        const { phone } = await updateShopperVerifier.parseAsync({ phone: phoneNumber });
        shopperCurrentPhone = phone;
      }

      const redis = getRedis();
      const foundOtpOnRedis = await redis.get(`${shopper._id}-${shopperCurrentPhone}`);
      if (foundOtpOnRedis !== otp) {
        return res.status(400).send({
          message: "otp not found",
        });
      }

      await setLastOtpDateToShopper(shopperData.data._id);
      if (!shopperData.data.phone) {
        const { data: phoneNumberResult, error: phoneNumberError } = await setPhoneNumberToShopper(shopper._id, shopperCurrentPhone);
        if (phoneNumberError || !phoneNumberResult) {
          return res.status(400).send({
            error: phoneNumberError,
          });
        }
      }
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

    let newCard;
    let alreadyHaveCard;
    if (savedCardId) {
      const hasSavedCardWithId = shopperData.data?.cards.find((_card) => (_card as any)._id.toString() === savedCardId);

      if (!hasSavedCardWithId) {
        res.status(400).send({
          errorCode: SAVED_CARD_NOT_FOUND_IN_USER,
        });
      }
    }

    if (!savedCardId) {
      const validatedCard = await shopperCardVerifier.parseAsync(card);
      alreadyHaveCard = shopperData.data.cards.find((_card) => _card.cardNo === validatedCard.cardNo);
      if (!alreadyHaveCard) {
        newCard = await addCardToShopper(shopper._id, validatedCard);
        if (newCard.error || !newCard.data) {
          return res.status(400).send({
            message: "card can not created",
            error: newCard.error,
          });
        }
      }
    }

    const objectShopperData = (shopperData.data as any).toObject();
    const newOrder = {
      company: companyId,
      shopper: shopperData.data._id,
      desk,
      campaigns: objectShopperData.basket.campaigns,
      products: objectShopperData.basket.products,
      cardId: savedCardId || (alreadyHaveCard as any)?._id || (newCard.data as any)._id,
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

    const io = getIO();

    io.to(companyId).emit("refresh:kitchen");
    res.send(createdOrder);
  } catch (error) {
    res.send(error);
  }
};
