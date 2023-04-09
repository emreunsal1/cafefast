import companyModel, { ICompany } from "../models/company";

export const createCompany = async (companyData: ICompany) => {
  try {
    const newCompany = await companyModel.create(companyData);
    return { data: newCompany };
  } catch (error) {
    return { error: (error as any).message || error };
  }
};

export const getCompany = async ({
  query,
  populate = false,
}: {query, populate?: boolean}) => {
  try {
    const mongooseQuery = companyModel.findOne({ ...query, isDeleted: false });

    if (populate) {
      mongooseQuery.populate("menus");
    }

    const response = await mongooseQuery.exec();
    return { data: response };
  } catch (error) {
    return { error: (error as any).message || error };
  }
};

export const updateCompany = async (query, data) => {
  try {
    const response = await companyModel.findOneAndUpdate(query, data, { new: true }).exec();
    return { data: response };
  } catch (error) {
    return { error: (error as any).message || error };
  }
};

export const addMenuToCompany = async (query, menuId) => {
  try {
    const response = await companyModel.findOneAndUpdate(
      query,
      { $push: { menus: menuId } },
      { new: true },
    ).populate("menus").exec();

    return { data: response };
  } catch (error) {
    return { error: (error as any).message || error };
  }
};

export const checkCompanyHasMenu = async ({
  menuId, companyId,
}) => companyModel.findOne({ menus: menuId, _id: companyId });

export const removeMenuFromCompany = async (menuId: any):Promise<{data?: any, error?: any}> => {
  try {
    const newCompany = await companyModel.findOneAndUpdate({ menus: menuId }, { $pull: { menus: menuId } }, { new: true });

    return { data: newCompany };
  } catch (error) {
    return { error };
  }
};

export const addProductToCompany = async (companyId, productId) => {
  try {
    const newCompany = await companyModel.findOneAndUpdate(
      { _id: companyId },
      { $push: { products: productId } },
      { new: true },
    );

    return { data: newCompany };
  } catch (error) {
    return { error };
  }
};

export const removeProductFromCompany = async (companyId, productId) => {
  try {
    const newCompany = await companyModel.findOneAndUpdate(
      { _id: companyId },
      { $pull: { products: productId } },
      { new: true },
    );

    return { data: newCompany };
  } catch (error) {
    return { error };
  }
};
