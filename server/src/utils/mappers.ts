export const mapUserForJWT = (userData) => ({
  _id: userData._id,
  email: userData.email,
  company: userData.company,
});

export const mapShopperForJWT = (shopperData) => ({
  _id: shopperData._id,
  phone: shopperData.phone,
});
