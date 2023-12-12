import mongoose, { Schema } from "mongoose";
import z from "zod";

export enum ProductAttributeType {
  SINGLE = "single",
  MULTI = "multi",
}

export const productAttributeValidator = z.object({
  title: z.string().max(255),
  description: z.string().max(255),
  type: z.nativeEnum(ProductAttributeType),
  required: z.boolean(),
  options: z.array(z.object({
    name: z.string().max(255),
    price: z.number(),
  })),
});

export const createProductValidator = z.object({
  name: z.string().min(1),
  description: z.string().min(5),
  price: z.number(),
  images: z.array(z.string()),
  attributes: productAttributeValidator.array(),
  menuPrices: z.array(z.object({ menuId: z.string(), price: z.number().positive() })).optional(),
  inStock: z.boolean().optional(),
});

export const updateProductValidator = createProductValidator.partial();
export const bulkUpdateCreateValidator = createProductValidator.pick({ name: true, description: true, price: true });

export type IProduct = z.infer<typeof createProductValidator>;

const productSchema = new Schema<IProduct>({
  name: String,
  description: String,
  price: Number,
  images: [{ type: String, default: [] }],
  attributes: { type: [], _id: false },
  menuPrices: { type: [{ menuId: String, price: Number }], default: [] },
  inStock: { type: Boolean, default: true },
});

const productModel = mongoose.model<IProduct>("product", productSchema);

export default productModel;
