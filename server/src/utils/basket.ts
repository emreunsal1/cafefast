import { mapCampaign, mapProduct } from "./mappers";

type BasketObject = {
  product?: any;
  campaign?: any;
  companyId: string;
}

export const createBasketObject = ({ product, campaign, companyId }: BasketObject) => {
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
    product.selectedAttributes.forEach((selectedAttributes) => {
      selectedAttributes.options.forEach((selectedOption) => { totalPrice += (selectedOption.price * product.count); });
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { attributes, ...mappedProduct } = mapProduct(product.product);

    allProducts.push({ product: mappedProduct, count: product.count, selectedAttributes: product.selectedAttributes });
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

export const findChangedProductsInBasket = (basketProducts) => {
  const _changedProductIds = basketProducts.reduce((changedProductIds, product: any) => {
    const productId = product.product._id.toString();

    product.selectedAttributes.forEach((selectedAttribute) => {
      const foundProductAttribute = product.product.attributes.find(
        (_productAttr) => _productAttr.title === selectedAttribute.title
         && _productAttr.type === selectedAttribute.type
         && _productAttr.required === selectedAttribute.required,
      );

      if (!foundProductAttribute) {
        changedProductIds.add(productId);
      }

      const productAttributeOptionsAsString = foundProductAttribute.options.map((_option) => JSON.stringify(_option));

      const isOptionsExists = selectedAttribute.options.every((_option) => productAttributeOptionsAsString.includes(JSON.stringify(_option)));

      if (!isOptionsExists) {
        changedProductIds.add(productId);
      }
    });

    return changedProductIds;
  }, new Set<any>());

  return [..._changedProductIds];
};
