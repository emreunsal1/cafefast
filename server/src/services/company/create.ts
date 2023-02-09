import mongoose from "mongoose";
import companyModel from "../../models/company";
import { ICreateCompany } from "../../utils/interfaces/company";

const createCompany = async (data:ICreateCompany):Promise<any> => {
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

export default createCompany;
