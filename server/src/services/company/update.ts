import mongoose, { Types } from "mongoose";
import companyModel from "../../models/company";

const updateCompany = async (id:Types.ObjectId, data:any) => {
  try {
    const response = await companyModel.findOneAndUpdate({ _id: id }, { data }, { new: true });
    return response;
  } catch (error: Error | unknown) {
    if (error instanceof mongoose.Error.ValidationError) {
      return error.message;
    }
  }
};

export default updateCompany;
