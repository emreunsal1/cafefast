import companyModel, { ICompany } from "../models/company";

export const createCompany = async (companyData: ICompany) => {
  try {
    const newCompany = await companyModel.create(companyData);
    return { data: newCompany };
  } catch (error) {
    return { error };
  }
};

export const getCompany = async ({
  query,
  populate = false,
}: {query: Partial<ICompany & {_id: any}>, populate?: boolean}): Promise<{data?: ICompany | null, error?: any}> => {
  try {
    const mongooseQuery = companyModel.findOne({ ...query, isDeleted: false });

    if (populate) {
      mongooseQuery.populate("menus");
    }

    const response = await mongooseQuery.exec();
    return { data: response };
  } catch (error) {
    return { error };
  }
};

export const updateCompany = async (query: Partial<ICompany & {_id: any}>, data: Partial<ICompany>):Promise<{data?: any, error?: any}> => {
  try {
    const response = await companyModel.findOneAndUpdate(query, data, { new: true }).exec();
    return { data: response };
  } catch (error) {
    return { error };
  }
};

export const addMenuToCompany = async (query: Partial<ICompany & {_id: any}>, menuId: any):Promise<{data?: any, error?: any}> => {
  try {
    const response = await companyModel.findOneAndUpdate(
      query,
      { $push: { menus: menuId } },
      { new: true },
    ).exec();

    return { data: response };
  } catch (error) {
    return { error };
  }
};

export const removeMenuFromCompany = async (menuId: any, companyId: any):Promise<{data?: any, error?: any}> => {
  try {
    const newMenu = await companyModel.findOneAndUpdate({ menus: menuId, companyId }, { $pull: { menus: menuId } }, { new: true });

    if (!newMenu) {
      return { error: "menu not found" };
    }
    return { data: newMenu };
  } catch (error) {
    return { error };
  }
};
