import z from "zod";
import mongoose, { Schema } from "mongoose";

export const createOrderValidator = z.object({
  shopper: z.string(),
  company: z.string(),
  products: z.array(z.object({ product: z.string(), count: z.number() })),
  campaigns: z.array(z.object({ campaign: z.string(), count: z.number() })),
  approved: z.boolean(),
  cardId: z.string(),
  status: z.enum(["created", "ready", "delivered", "canceled"]),
  isDeleted: z.boolean(),
});

export const updateOrderValidator = createOrderValidator.partial();

export type IOrder = z.infer<typeof createOrderValidator>;

const orderSchema = new Schema<IOrder>(
  {
    shopper: { type: String, ref: "shopper" },
    company: String,
    products: {
      type: [{ product: { type: String, ref: "product" }, count: Number }],
      default: [],
    },
    campaigns: {
      type: [{ campaign: { type: String, ref: "campaign" }, count: Number }],
      default: [],
    },
    approved: { type: Boolean, default: false },
    status: { type: String, default: "created" },
    cardId: String,
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const orderModel = mongoose.model<IOrder>("order", orderSchema);

export default orderModel;
