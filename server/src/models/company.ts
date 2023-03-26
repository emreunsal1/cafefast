import mongoose from "mongoose";

export type ICompany = {
  name: string;
  address: {
    city: string;
    district: string;
    mailingAddress: string;
    postalCode: string;
  }
  isDeleted?: boolean;
}

const companySchema = new mongoose.Schema<ICompany>({
  name: String,
  address: {
    city: String,
    district: String,
    mailingAddress: String,
    postalCode: String,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const companyModel = mongoose.model("company", companySchema);

export default companyModel;
