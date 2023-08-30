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
  desks?: string[],
  menus?: number[];
  activeMenu?: string | null;
  isDeleted?: boolean;
  products?: string[];
  campaigns?: string[];
}

const companySchema = new mongoose.Schema<ICompany>({
  name: String,
  address: {
    city: String,
    district: String,
    mailingAddress: String,
    postalCode: Number,
  },
  desks: {
    type: [String],
    default: [],
  },
  menus: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "menu",
    default: [],
  }],
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
    default: [],
  }],
  campaigns: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "campaign",
    default: [],
  }],
  activeMenu: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "menu",
    default: null,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const companyModel = mongoose.model("company", companySchema);

export const createCompanyValidator = z.object({
  name: z.string().min(3).max(255),
  activeMenu: z.string().min(3).max(255).optional(),
  products: z.array(z.string()).optional().default([]),
  address: z.object({
    city: z.string().min(3).max(255),
    district: z.string().min(3).max(255),
    mailingAddress: z.string().min(3).max(255),
    postalCode: z.number().min(10000).max(99999),
  }),
});

export const companyDesksValidator = z.array(z.string().max(255).min(1));

export const updateCompanyValidator = createCompanyValidator.partial();

export default companyModel;
