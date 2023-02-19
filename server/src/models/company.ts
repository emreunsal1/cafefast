import mongoose from "mongoose";

export type ICompany = {
  name: string;
  isDeleted: boolean;
}

export type ICreateCompany = Omit<ICompany, "isDeleted">

const companySchema = new mongoose.Schema<ICompany>({
  name: "string",
  isDeleted: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const companyModel = mongoose.model("company", companySchema);

export default companyModel;
