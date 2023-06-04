export const checkMenuHasProduct = (menu, productId) => {
  const menuProducts = menu.categories.reduce((allProducts, category) => [...allProducts, ...category.products], []);
  return menuProducts.some((product) => String(product._id) === productId);
};

export const checkMenuHasCampaign = (menu, campaignId) => menu.campaigns.some((campaign) => campaign._id === campaignId);
