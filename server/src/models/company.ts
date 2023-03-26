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
  menus: number[];
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
  menus: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "menu",
    default: [],
  }],
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
    postalCode: z.number().min(10000).max(99999),
  }),
});

export default companyModel;
