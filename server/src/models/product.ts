import mongoose, { Schema } from "mongoose";
import z from "zod";

export const createProductValidator = z.object({
  name: z.string(),
  description: z.string(),
  price: z.number(),
  images: z.array(z.string()).default([]),
  attributes: z.array(z.object({ name: z.string(), price: z.number() })).default([]).optional(),
  requiredAttributeCount: z.number().default(0).optional(),
  inStock: z.boolean().default(true).optional(),
});

export const updateProductValidator = createProductValidator.omit({ attributes: true, images: true }).optional();

export type IProduct = z.infer<typeof createProductValidator>;

const productSchema = new Schema<IProduct>({
  name: String,
  description: String,
  price: Number,
  images: [{ type: String, default: [] }],
  attributes: [{ name: String, price: Number, default: [] }],
  requiredAttributeCount: { type: Number, default: 0 },
  inStock: { type: Boolean, default: true },
});

const productModel = mongoose.model("product", productSchema);

export default productModel;
