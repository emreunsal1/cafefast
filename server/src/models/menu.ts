import mongoose, { Schema } from "mongoose";
import z from "zod";

export type IMenu = {
  name: String,
  campaigns?: mongoose.Schema.Types.ObjectId[],
  categories?: mongoose.Schema.Types.ObjectId[],
  products?: mongoose.Schema.Types.ObjectId[],
}

const menuSchema = new Schema({
  name: String,
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
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
    default: [],
  }],
});

export const createMenuVerifier = z.object({
  name: z.string().min(3).max(255),
});

const menuModel = mongoose.model("menu", menuSchema);

export default menuModel;
