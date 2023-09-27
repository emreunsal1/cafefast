import companyModel, { ICompany } from "../models/company";
import { getMenu } from "./menu";

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

export const getCompanyActiveMenu = async (companyId, populate = false) => {
  try {
    const query = companyModel.findOne({ _id: companyId });

    if (populate) {
      query
        .populate({
          path: "activeMenu",
          populate: {
            path: "categories",
            options: {
              populate: {
                path: "products",
              },
            },
          },
        })
        .populate({
          path: "activeMenu",
          populate: {
            path: "campaigns",
            options: {
              populate: {
                path: "products",
              },
            },
          },
        });
    }

    const result = await query.exec();
    return { data: result?.activeMenu };
  } catch (err) {
    console.log("error :>> ", err);
    return { error: err };
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

export const getDesks = async (companyId) => {
  try {
    const result = await companyModel.findOne({ company: companyId }).select("desks");

    return {
      data: result?.desks,
    };
  } catch (error) {
    return {
      error: (error as any).message || error,
    };
  }
};

export const updateCompanyDesks = async (companyId, desks: string[]) => {
  try {
    const response = await companyModel.findOneAndUpdate(
      companyId,
      {
        $set: {
          desks,
        },
      },
      { new: true },
    ).select("desks").exec();

    return { data: response };
  } catch (error) {
    return { error: (error as any).message || error };
  }
};

export const checkCompanyHasDesk = async ({
  desk, companyId,
}) => companyModel.findOne({ desks: desk, _id: companyId });

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
export const addProductsToCompany = async (companyId, productIds) => {
  try {
    const newCompany = await companyModel.findOneAndUpdate(
      { _id: companyId },
      { $push: { products: { $each: productIds } } },
      { new: true },
    );

    return { data: newCompany };
  } catch (error) {
    return { error };
  }
};

export const getCompanyCampaigns = async (companyId) => {
  try {
    const result = await companyModel.findOne({ company: companyId }).populate({
      path: "campaigns",
      populate: {
        path: "products",
        model: "product",
      },
    }).select("campaigns");

    return {
      data: result?.toObject()?.campaigns,
    };
  } catch (error) {
    return {
      error: (error as any).message || error,
    };
  }
};

export const addCampaignToCompany = async (companyId, campaignId) => {
  try {
    const newCompany = await companyModel.findOneAndUpdate(
      { _id: companyId },
      { $push: { campaigns: campaignId } },
      { new: true },
    );

    return { data: newCompany };
  } catch (error) {
    return { error };
  }
};

export const removeCampaignFromCompany = async (campaignId: any):Promise<{data?: any, error?: any}> => {
  try {
    const newCompany = await companyModel.findOneAndUpdate({ campaigns: campaignId }, { $pull: { campaigns: campaignId } }, { new: true });

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
