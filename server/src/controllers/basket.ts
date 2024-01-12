import { Request, Response } from "express";
import {
  addCampaignToShopper,
  addCardToShopper,
  addOrderToShopper,
  addProductToShopper,
  clearShopperBasket,
  deleteCampaignFromShopper,
  deleteProductFromShopper,
  deleteProductsFromShopper,
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
  SAVED_CARD_NOT_FOUND_IN_USER,
} from "../constants";
import { findChangedProductsInBasket, mapBasket } from "../utils/basket";
import { createOrder } from "../services/order";
import { getIO } from "../utils/socket";
import { ProductAttributeType } from "../models/product";
import { checkOtpIsValid, checkUserNeedOtp, sendOtp } from "../services/otp";
import { OTPType } from "../models/otp";
import logger from "../utils/logger";

export const addProductToBasketController = async (req: Request, res: Response) => {
  const { shopper } = req;
  const { productId, attributes } = req.body;
  const { companyActiveMenu } = res.locals;

  const foundProductInMenu = checkMenuHasProduct(companyActiveMenu, productId);
  if (!foundProductInMenu) {
    return res.status(400).json({
      error: "Product not found in company active menu",
    });
  }

  const attributeErrors: any = [];
  const productAttributes = foundProductInMenu.attributes;
  const selectedAttributes = (attributes as any[]).reduce((prev, curr) => {
    const attributeIndex = curr.index;
    const attributeSelectedOptions = curr.options;

    const foundAttr = productAttributes.find((_, index) => index === attributeIndex);

    if (!foundAttr) {
      attributeErrors.push({
        index: attributeIndex,
        error: "Sent attribute index not found",
      });
    }
    if (foundAttr) {
      const selectedAttributeOptions = attributeSelectedOptions.map((index) => foundAttr.options[index]);

      const requiredButNotSelected = foundAttr.required && selectedAttributeOptions.length === 0;
      const singleButMultiSelected = foundAttr.type === ProductAttributeType.SINGLE && selectedAttributeOptions.length > 1;

      if (requiredButNotSelected) {
        attributeErrors.push({
          title: foundAttr.title,
          error: "At least one option required",
        });
      }
      if (singleButMultiSelected) {
        attributeErrors.push({
          title: foundAttr.title,
          error: "Option is single but multi option selected",
        });
      }

      prev.push({
        ...foundAttr,
        options: selectedAttributeOptions,
      });
    }
    return prev;
  }, []);

  if (attributeErrors.length > 0) {
    return res.status(400).send({
      message: "Attributes has vaildation errors",
      attributeErrors,
    });
  }

  const newShopper = await addProductToShopper(shopper._id, { productId, selectedAttributes });
  if (newShopper.error || !newShopper.data) {
    return res.status(400).send({
      error: newShopper.error,
    });
  }

  res.status(201).send(newShopper);
};

export const addCampaignToBasketController = async (req: Request, res: Response) => {
  const { shopper } = req;
  const { campaignId } = req.params;
  const { shopperData, companyActiveMenu } = res.locals;

  const isCampaignExistsInActiveMenu = checkMenuHasCampaign(companyActiveMenu, campaignId);
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

  const changedProductIds = findChangedProductsInBasket(data?.basket?.products);
  if (changedProductIds.length > 0) {
    await deleteProductsFromShopper({ shopperId: shopper._id, productIds: changedProductIds });
    return res.status(400).send({
      code: "BASKET_CHANGED",
      message: "Products are changed after you added to basket. Please add it again",
      changedProductIds,
    });
  }

  res.send(mapBasket(data.toObject()));
};

export const updateQuantityController = async (req: Request, res: Response, next) => {
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
    next(err);
  }
};

export const deleteProductInBasketController = async (req: Request, res: Response, next) => {
  try {
    const { shopper } = req;
    const { companyId, productId } = req.params;

    const companyActiveMenu = await getCompanyActiveMenu(companyId, true);

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
    next(error);
  }
};

export const deleteCampaignInBasketController = async (req: Request, res: Response, next) => {
  try {
    const { shopper } = req;
    const { companyId, campaignId } = req.params;

    const companyActiveMenu = await getCompanyActiveMenu(companyId, true);

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
    next(error);
  }
};

export const getShopperSavedCardController = async (req: Request, res: Response) => {
  const { shopper } = req;

  const shopperData = await getShopper(shopper._id, true);

  if (shopperData.error || !shopperData.data?.phone) {
    return res.status(400).send({
      message: "Should save phone number for getting saved cards",
      error: SAVED_CARD_NOT_FOUND_IN_USER,
    });
  }

  res.send(mapSavedCards(shopperData.data?.cards));
};

export const sendOtpController = async (req: Request, res: Response, next) => {
  const { phoneNumber } = req.body;
  const { shopperData } = res.locals;

  try {
    const isUserNeedOtp = checkUserNeedOtp(shopperData.lastOtpDate);
    let currentPhone = shopperData.phone;

    if (!currentPhone) {
      const { phone } = await updateShopperVerifier.parseAsync({ phone: phoneNumber });
      currentPhone = phone;
    }

    if (isUserNeedOtp) {
      await sendOtp({ target: currentPhone, type: OTPType.PHONE });
      res.send({ success: true });
      return;
    }

    logger.error({
      action: "NO_NEED_TO_OTP",
      shopperData,
      message: "shopper do not need a otp",
    });
    res.status(400).send({ message: "User not need otp" });
  } catch (error) {
    next(error);
  }
};

export const needOtpController = async (_req: Request, res: Response) => {
  const { shopperData } = res.locals;

  const isUserNeedOtp = checkUserNeedOtp(shopperData.lastOtpDate);

  res.send({ otpRequired: isUserNeedOtp });
};

export const approveBasketController = async (req: Request, res: Response, next) => {
  try {
    const { shopper } = req;
    const { companyId } = req.params;
    const {
      price, card, desk,
      phoneNumber, otp, savedCardId,
    } = req.body;

    if (savedCardId && card) {
      return res.status(400).send({
        message: "you can not send savedCardId and card same time",
      });
    }

    const hasDesk = await checkCompanyHasDesk({ companyId, desk });
    if (!hasDesk) {
      return res.status(404).send({
        message: "sent desk not found",
      });
    }

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

    const isNewUser = !shopperData.data.phone;
    let shopperCurrentCard;

    // new user cases
    if (isNewUser) {
      const { phone } = await updateShopperVerifier.parseAsync({ phone: phoneNumber });
      const isOtpValid = await checkOtpIsValid({
        otp,
        shopperId: shopperData.data._id,
        shopperLastOtpDate: shopperData.data.lastOtpDate,
        shopperPhone: phone,
      });
      if (!isOtpValid) {
        return res.status(400).send({
          message: "Sent OTP is not valid",
        });
      }

      const { data: phoneNumberResult, error: phoneNumberError } = await setPhoneNumberToShopper(shopper._id, phone);
      if (phoneNumberError || !phoneNumberResult?.phone) {
        return res.status(400).send({
          error: phoneNumberError,
          message: "error when saving phone to user",
        });
      }

      const validatedCard = await shopperCardVerifier.parseAsync(card);
      const alreadyHaveCard = shopperData.data.cards.find((_card) => JSON.stringify(_card) === JSON.stringify(validatedCard));
      shopperCurrentCard = alreadyHaveCard;
      if (!alreadyHaveCard) {
        const newCard = await addCardToShopper(shopper._id, validatedCard);
        if (newCard.error || !newCard.data) {
          return res.status(400).send({
            message: "card can not created",
            error: newCard.error,
          });
        }
        shopperCurrentCard = newCard.data;
      }

      // Update OTP Date
      await setLastOtpDateToShopper(shopper._id);
    }

    // saved user cases
    if (!isNewUser) {
      if (card && !savedCardId) {
        const validatedCard = await shopperCardVerifier.parseAsync(card);
        const alreadyHaveCard = shopperData.data.cards.find((_card) => JSON.stringify(_card) === JSON.stringify(validatedCard));
        shopperCurrentCard = alreadyHaveCard;
        if (!alreadyHaveCard) {
          const newCard = await addCardToShopper(shopper._id, validatedCard);
          if (newCard.error || !newCard.data) {
            return res.status(400).send({
              message: "card can not created",
              error: newCard.error,
            });
          }
          shopperCurrentCard = newCard.data;
        }

        // Update OTP Date
        await setLastOtpDateToShopper(shopper._id);
      }

      if (savedCardId && !card) {
        const hasSavedCardWithId = shopperData.data?.cards.find((_card) => (_card as any)._id.toString() === savedCardId);

        if (!hasSavedCardWithId) {
          res.status(400).send({
            errorCode: SAVED_CARD_NOT_FOUND_IN_USER,
          });
        }
        shopperCurrentCard = hasSavedCardWithId;
        const isOtpValid = await checkOtpIsValid({
          otp,
          shopperId: shopper._id,
          shopperLastOtpDate: shopperData.data.lastOtpDate,
          shopperPhone: shopperData.data.phone,
        });
        if (!isOtpValid) {
          return res.status(400).send({
            message: "Sent OTP is not valid",
          });
        }
        // Update OTP Date
        await setLastOtpDateToShopper(shopper._id);
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

    const objectShopperData = (shopperData.data as any).toObject();
    const newOrder = {
      company: companyId,
      shopper: shopperData.data._id,
      desk,
      campaigns: objectShopperData.basket.campaigns,
      products: objectShopperData.basket.products,
      cardId: shopperCurrentCard._id,
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

    const { data: addOrderData, error: addOrderError } = await addOrderToShopper(shopper._id, createdOrder._id);
    if (addOrderError || !addOrderData) {
      return res.status(400).send({
        message: "order can not added to shopper",
        stack: addOrderError,
      });
    }

    const io = getIO();

    io.to(companyId).emit("refresh:kitchen");
    res.send(createdOrder);
  } catch (error) {
    next(error);
  }
};
