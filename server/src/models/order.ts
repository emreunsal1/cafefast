import z from "zod";
import mongoose, { Schema } from "mongoose";

export enum OrderStatus {
  WAITING_APPROVE = "waiting_approve",
  IN_PROGRESS = "in_progress",
  READY = "ready",
  DELIVERED = "delivered",
  CANCELED = "canceled"
}

export const createOrderValidator = z.object({
  shopper: z.string(),
  company: z.string(),
  desk: z.string(),
  products: z.array(z.object({ product: z.string(), count: z.number() })),
  campaigns: z.array(z.object({ campaign: z.string(), count: z.number() })),
  cardId: z.string(),
  status: z.nativeEnum(OrderStatus),
  isDeleted: z.boolean(),
});

export const updateOrderValidator = createOrderValidator.pick({ approved: true, status: true });

export type IOrder = z.infer<typeof createOrderValidator>;

const orderSchema = new Schema<IOrder>(
  {
    shopper: { type: String, ref: "shopper" },
    company: String,
    desk: String,
    products: {
      type: [Object],
      default: [],
    },
    campaigns: {
      type: [Object],
      default: [],
    },
    status: { type: String, default: OrderStatus.WAITING_APPROVE },
    cardId: String,
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const orderModel = mongoose.model<IOrder>("order", orderSchema);

export default orderModel;
