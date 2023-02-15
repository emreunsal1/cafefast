import mongoose from "mongoose";
import companyModel, { ICreateCompany } from "../../models/company";

export const createCompany = async (data: ICreateCompany) => {
  try {
    const {
      companyName,
    } = data;

    const newCompany = await companyModel.create({ companyName });
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
