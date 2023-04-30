import mongoose, { Schema } from "mongoose";
import z from "zod";

export type IMenu = {
  name: String,
  description?: String,
  campaigns?: mongoose.Schema.Types.ObjectId[],
  categories?: mongoose.Schema.Types.ObjectId[],
}

const menuSchema = new Schema({
  name: String,
  description: {
    type: String,
    ref: "description",
    default: "",
  },
  campaigns: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "campaign",
    default: [],
  }],
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "category",
    default: [],
  }],
});

export const createMenuVerifier = z.object({
  name: z.string().min(3).max(255),
  description: z.string().min(3).max(255).optional(),
  campaigns: z.array(z.string()).optional(),
  categories: z.array(z.string()).optional(),
});

export const updateMenuVerifier = createMenuVerifier.optional();

const menuModel = mongoose.model("menu", menuSchema);

export default menuModel;
