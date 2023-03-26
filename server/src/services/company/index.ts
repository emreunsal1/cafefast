import companyModel, { ICompany } from "../../models/company";

export const createCompany = async (companyData: ICompany) => {
  try {
    const newCompany = await companyModel.create(companyData);
    return { data: newCompany };
  } catch (error) {
    return { error };
  }
};

export const getCompany = async (id): Promise<{data?: any, error?: any}> => {
  try {
    const response = await companyModel.findOne({ _id: id, isDeleted: false }).exec();
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
