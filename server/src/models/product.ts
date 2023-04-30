import mongoose, { Schema } from "mongoose";
import z from "zod";

export const createProductValidator = z.object({
  name: z.string(),
  description: z.string(),
  price: z.number(),
  images: z.array(z.string().url()),
  attributes: z.array(z.object({ name: z.string(), price: z.number() })).optional(),
  requiredAttributeCount: z.number().default(0).optional(),
  menuPrices: z.array(z.object({ menuId: z.string(), price: z.number().positive() })).optional(),
  inStock: z.boolean().optional(),
});

export const updateProductValidator = createProductValidator.omit({ attributes: true }).partial();

export type IProduct = z.infer<typeof createProductValidator>;

const productSchema = new Schema<IProduct>({
  name: String,
  description: String,
  price: Number,
  images: [{ type: String, default: [] }],
  attributes: { type: [{ name: String, price: Number }], default: [] },
  requiredAttributeCount: { type: Number, default: 0 },
  menuPrices: { type: [{ menuId: String, price: Number }], default: [] },
  inStock: { type: Boolean, default: true },
});

const productModel = mongoose.model<IProduct>("product", productSchema);

export default productModel;
