import { mapCampaign, mapProduct } from "./mappers";

export const createBasketObject = ({ product, campaign, companyId }) => {
  const newBasketObject: any = {
    company: companyId,
    products: [],
    campaigns: [],
  };
  if (product) {
    newBasketObject.products.push({
      product,
      count: 1,
    });
  }
  if (campaign) {
    newBasketObject.campaigns.push({
      campaign,
      count: 1,
    });
  }

  return newBasketObject;
};

export const mapBasket = (shopperData) => {
  const { basket: { products, campaigns } } = shopperData;

  let totalPrice = 0;
  const allProducts: any = [];
  const allCampaigns: any = [];

  products.forEach((product) => {
    totalPrice += (product.product.price * product.count);
    allProducts.push({ ...mapProduct(product.product), count: product.count });
  });

  campaigns.forEach((campaign) => {
    totalPrice += (campaign.campaign.price * campaign.count);
    allCampaigns.push({ ...mapCampaign(campaign.campaign), count: campaign.count });
  });

  return {
    campaigns: allCampaigns,
    products: allProducts,
    totalPrice,
    totalPriceText: `${totalPrice} TL`,
    totalPriceSymbolText: `₺${totalPrice}`,
  };
};
