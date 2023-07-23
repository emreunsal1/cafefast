import { mapBasket } from "./basket";

export const mapUserForJWT = (userData) => ({
  _id: userData._id,
  email: userData.email,
  company: userData.company,
});

export const mapShopperForJWT = (shopperData) => ({
  _id: shopperData._id,
  phone: shopperData.phone,
});

const mapShopperInfoForOrders = (shopper, cardId) => {
  const foundCard = shopper?.cards?.find((card) => String(card._id) === cardId);

  if (!foundCard) {
    return null;
  }

  return {
    name: foundCard.name,
    phone: foundCard.phone,
  };
};

export const mapOrders = (orders: Array<any>) => {
  const mappedOrders = orders.map((order) => {
    const foundInfo = mapShopperInfoForOrders(order.shopper, order.cardId);
    const basketInfo = mapBasket({ basket: { campaigns: order.campaigns, products: order.products } });

    return {
      _id: order._id,
      shopper: foundInfo,
      products: order.products,
      campaigns: order.campaigns,
      status: order.status,
      approved: order.approved,
      isDeleted: order.isDeleted,
      totalPrice: basketInfo.totalPrice,
      totalPriceText: basketInfo.totalPriceText,
      totalPriceSymbolText: basketInfo.totalPriceSymbolText,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  });

  return mappedOrders;
};
