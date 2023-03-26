import mongoose from "mongoose";
import z from "zod";

export type ICompany = {
  name: string;
  address: {
    city: string;
    district: string;
    mailingAddress: string;
    postalCode: number;
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

export const createCompanyValidator = z.object({
  name: z.string().min(3).max(255),
  address: z.object({
    city: z.string().min(3).max(255),
    district: z.string().min(3).max(255),
    mailingAddress: z.string().min(3).max(255),
    postalCode: z.number().min(5).max(5),
  }),
});

export default companyModel;
