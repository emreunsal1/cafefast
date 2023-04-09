export const validateCompanyHasProducts = async (companyData, productIds) => {
  try {
    const hasInvalid = productIds.some((id) => !companyData?.products?.includes(id));
    return !hasInvalid;
  } catch (error) {
    return { error };
  }
};
