import mongoose, { Schema } from "mongoose";
import z from "zod";

export type IMenu = {
  name: String,
  description?: String,
  campaigns?: mongoose.Schema.Types.ObjectId[],
  categories?: mongoose.Schema.Types.ObjectId[],
  products?: mongoose.Schema.Types.ObjectId[],
}

const menuSchema = new Schema({
  name: String,
  description: String,
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
});

export const updateMenuVerifier = createMenuVerifier.optional();

const menuModel = mongoose.model("menu", menuSchema);

export default menuModel;
