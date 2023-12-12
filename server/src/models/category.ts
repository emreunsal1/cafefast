import mongoose, { Schema } from "mongoose";
import z from "zod";

export const createCategoryValidator = z.object({
  name: z.string().min(1),
  products: z.array(z.string()).optional(),
  image: z.string().optional(),
});

export const updateCategoryValidator = createCategoryValidator.partial();

export type ICategory = z.infer<typeof createCategoryValidator>;

const categorySchema = new Schema<ICategory>({
  name: String,
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
    default: [],
  }],
  image: { type: String },
});

const categoryModel = mongoose.model("category", categorySchema);

export default categoryModel;
