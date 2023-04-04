import mongoose, { Schema } from "mongoose";
import z from "zod";

export const createCategoryValidator = z.object({
  name: z.string(),
  order: z.number(),
  images: z.array(z.string()).default([]).optional(),
});

export const updateCategoryValidator = createCategoryValidator.omit({ images: true }).optional();

export type ICategory = z.infer<typeof createCategoryValidator>;

const categorySchema = new Schema<ICategory>({
  name: String,
  order: Number,
  images: [{ type: String, default: [] }],
});

const categoryModel = mongoose.model("category", categorySchema);

export default categoryModel;
