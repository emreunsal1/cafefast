import z from "zod";
import mongoose, { Schema } from "mongoose";

export const createShopperVerifier = z.object({
  phone: z.string().optional(),
  basket: z.object({
    products: z.array(z.string()),
    campaigns: z.array(z.string()),
  }),
  orders: z.array(z.string()).optional().default([]),
  cards: z.array(z.string()).optional().default([]),
});

export const updateShopperVerifier = createShopperVerifier.partial();

export type IShopper = z.infer<typeof createShopperVerifier>

const shopperSchema = new Schema<IShopper>({
  phone: String,
  basket: {
    products: [String],
    campaigns: [String],
  },
  orders: {
    type: [String],
    default: [],
  },
  cards: {
    type: [String],
    default: [],
  },
});

const shopperModel = mongoose.model("shopper", shopperSchema);

export default shopperModel;
