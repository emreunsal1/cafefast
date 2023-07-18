import z from "zod";
import mongoose, { Schema } from "mongoose";

export const createShopperVerifier = z.object({
  product: z.string().optional(),
  campaign: z.string().optional(),
});
export const shopperCardVerifier = z.object({
  cardNo: z.string().min(16).max(16),
  cvv: z.string().min(3).max(3),
  thruMonth: z.string().min(2).max(2),
  thruYear: z.string().min(2).max(2),
  name: z.string().max(255),
});
export const updateShopperVerifier = z.object({ phone: z.string() });
export const addNewItemVerifier = createShopperVerifier.pick({ product: true, campaign: true });
export const updateQuantityVerifier = createShopperVerifier.pick({ product: true, campaign: true }).merge(z.object({
  quantity: z.number().min(1).max(15),
}));

export type IShopper = z.infer<typeof createShopperVerifier>

const shopperSchema = new Schema({
  phone: {
    type: String,
    default: null,
  },
  basket: {
    company: String,
    products: {
      type: [{
        product: { type: String, ref: "product" },
        count: { type: Number, default: 1 },
        _id: false,
      }],
      default: [],
    },
    campaigns: {
      type: [{
        campaign: { type: String, ref: "campaign" },
        count: { type: Number, default: 1 },
        _id: false,
      }],
      default: [],
    },
  },
  orders: {
    type: [String],
    default: [],
  },
  cards: {
    type: [{
      cardNo: String,
      cvv: String,
      thruMonth: String,
      thruYear: String,
      name: String,
    }],
    default: [],
  },
});

const shopperModel = mongoose.model("shopper", shopperSchema);

export default shopperModel;
