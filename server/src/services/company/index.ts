import mongoose from "mongoose";
import companyModel, { ICompany } from "../../models/company";

export const createCompany = async (companyData: ICompany) => {
  try {
    const newCompany = await companyModel.create(companyData);
    return { data: newCompany };
  } catch (error: Error | unknown) {
    return { error };
  }
};

export const getCompany = async (id: string):Promise<any> => {
  try {
    const response = await companyModel.findOne({ _id: id, isDeleted: false }).exec();
    return response;
  } catch (error: Error | unknown) {
    if (error instanceof mongoose.Error.ValidationError) {
      return false;
    }
  }
};
