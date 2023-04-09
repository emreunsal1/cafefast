import mongoose, { Schema } from "mongoose";
import z from "zod";

export const createProductValidator = z.object({
  name: z.string(),
  description: z.string(),
  price: z.number(),
  images: z.array(z.string()).default([]),
  attributes: z.array(z.object({ name: z.string(), price: z.number() })).optional().default([]),
  requiredAttributeCount: z.number().default(0).optional(),
  menuPrices: z.array(z.object({ menuId: z.string(), price: z.number().positive() })).optional().default([]),
  inStock: z.boolean().default(true).optional(),
});

export const updateProductValidator = createProductValidator.omit({ attributes: true, images: true }).partial();

export type IProduct = z.infer<typeof createProductValidator>;

const productSchema = new Schema<IProduct>({
  name: String,
  description: String,
  price: Number,
  images: [{ type: String, default: [] }],
  attributes: [{ type: { name: String, price: Number }, default: [] }],
  requiredAttributeCount: { type: Number, default: 0 },
  menuPrices: [{ menuId: String, price: Number }],
  inStock: { type: Boolean, default: true },
});

const productModel = mongoose.model<IProduct>("product", productSchema);

export default productModel;
