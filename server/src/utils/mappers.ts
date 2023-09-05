import { config } from "dotenv";
import creditCardType from "credit-card-type";
import { mapBasket } from "./basket";

config();

export const mapUserForJWT = (userData) => ({
  _id: userData._id,
  email: userData.email,
  company: userData.company,
});

export const mapShopperForJWT = (shopperData) => ({
  _id: shopperData._id,
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
      desk: order.desk,
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

export const mapProduct = (_product) => ({
  ..._product,
  images: _product.images.map((image) => `${process.env.AWS_CLOUDFRONT_URL}/${image}`),
});

export const mapCampaign = (campaign) => ({
  ...campaign,
  products: campaign.products.map((product) => mapProduct(product)),
});
export const mapCategory = (category) => ({
  ...category,
  products: category.products.map((product) => mapProduct(product)),
});

export const mapMenu = (menu) => {
  const mappedMenu = menu;

  mappedMenu.categories = mappedMenu.categories.map(mapCategory);

  mappedMenu.campaigns = mappedMenu.campaigns.map(mapCampaign);

  return mappedMenu;
};

export const mapCampaigns = (campaigns) => campaigns.map((campaign) => mapCampaign(campaign));

export const mapSavedCards = (cards) => cards.map((card) => ({
  _id: card._id,
  cardNo: `**** **** **** ${card.cardNo.slice(-4)}`,
  name: `${card.name.substring(0, 3)}***`,
  type: creditCardType(card.cardNo)[0]?.niceType || null,
}));
