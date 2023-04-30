import mongoose, { Schema } from "mongoose";
import z from "zod";

export const createCategoryValidator = z.object({
  name: z.string(),
  products: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
});

export const updateCategoryValidator = createCategoryValidator.optional();

export type ICategory = z.infer<typeof createCategoryValidator>;

const categorySchema = new Schema<ICategory>({
  name: String,
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
    default: [],
  }],
  images: [{ type: String, default: [] }],
});

const categoryModel = mongoose.model("category", categorySchema);

export default categoryModel;
