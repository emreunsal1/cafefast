import mongoose from "mongoose";
import companyModel from "../../models/company";

interface IGetCompany {
  email:string,
  password:string,
}

const getCompany = async (data: IGetCompany):Promise<any> => {
  try {
    const { email, password } = data;
    const response = await companyModel.find({ email, password, isDeleted: false }).exec();
    return { respone: response, success: true };
  } catch (error: Error | unknown) {
    if (error instanceof mongoose.Error.ValidationError) {
      return { response: error.message, success: false };
    }
  }
};

export default getCompany;
