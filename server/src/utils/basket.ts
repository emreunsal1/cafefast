export const createBasketObject = ({ product, campaign }) => {
  const newBasketObject: any = {
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
    allProducts.push({ ...product.product.toObject(), count: product.count });
  });

  campaigns.forEach((campaign) => {
    totalPrice += (campaign.campaign.price * campaign.count);
    allCampaigns.push({ ...campaign.campaign.toObject(), count: campaign.count });
  });

  return {
    campaigns: allCampaigns,
    products: allProducts,
    totalPrice,
    totalPriceText: `${totalPrice} TL`,
    totalPriceSymbolText: `₺${totalPrice}`,
  };
};
