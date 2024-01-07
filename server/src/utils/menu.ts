export const checkMenuHasProduct = (menu, productId) => {
  const menuProducts = menu.categories.reduce((allProducts, category) => [...allProducts, ...category.products], []);
  return menuProducts.find((product) => String(product._id) === productId);
};

export const checkMenuHasCampaign = (menu, campaignId) => menu.campaigns.some((campaign) => String(campaign._id) === campaignId);

export const checkCategoryHasProduct = async (menuInfo, categoryId, productId) => {
  const foundCategory = menuInfo.categories.find((category) => category._id.toString() === categoryId);
  const hasProduct = foundCategory.products.some((product) => product._id.toString() === productId);

  return hasProduct;
};
