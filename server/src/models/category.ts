import mongoose, { Schema } from "mongoose";
import z from "zod";

export const createCategoryValidator = z.object({
  name: z.string(),
  order: z.number(),
  products: z.array(z.string()).optional().default([]),
  images: z.array(z.string()).default([]).optional(),
});

export const updateCategoryValidator = createCategoryValidator.omit({ images: true }).optional();

export type ICategory = z.infer<typeof createCategoryValidator>;

const categorySchema = new Schema<ICategory>({
  name: String,
  order: Number,
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
    default: [],
  }],
  images: [{ type: String, default: [] }],
});

const categoryModel = mongoose.model("category", categorySchema);

export default categoryModel;
