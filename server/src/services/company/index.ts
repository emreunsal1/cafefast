import mongoose, { Types } from "mongoose";
import companyModel from "../../models/company";
import { ICreateCompany } from "../../utils/interfaces/company";

interface IGetCompany {
  email:string,
  password:string,
}

export const createCompany = async (data:ICreateCompany):Promise<any> => {
  try {
    const {
      name, surname, companyName, email, password,
    } = data;

    const newCompany = await companyModel.create({
      name, surname, email, password, companyName,
    });
    return { respone: newCompany, success: true };
  } catch (error: Error | unknown) {
    if (error instanceof mongoose.Error.ValidationError) {
      return { response: error.message, success: false };
    }
  }
};

export const getCompany = async (data: IGetCompany):Promise<any> => {
  try {
    const { email, password } = data;
    const response = await companyModel.findOne({ email, password, isDeleted: false }).exec();
    return response;
  } catch (error: Error | unknown) {
    if (error instanceof mongoose.Error.ValidationError) {
      return false;
    }
  }
};

export const updateCompany = async (id:Types.ObjectId, data:any) => {
  try {
    const response = await companyModel.findOneAndUpdate({ _id: id }, { data }, { new: true });
    return response;
  } catch (error: Error | unknown) {
    if (error instanceof mongoose.Error.ValidationError) {
      return error.message;
    }
  }
};
