import mongoose, { Schema } from "mongoose";
import z from "zod";

export const createCampaignVerifier = z.object({
  name: z.string().min(3).max(255),
  price: z.number().positive(),
  image: z.string().url(),
  description: z.string().min(1).max(500),
  order: z.number().default(0),
  products: z.array(z.string()),
  applicable: z.object({
    end: z.date().optional(),
    time: z.object({
      start: z.date(),
      end: z.date(),
    }).optional(),
    days: z.array(z.number()).optional().default([]),
  }).optional(),
});

type ICampaign = z.infer<typeof createCampaignVerifier>

const campaignSchema = new Schema<ICampaign>({
  name: String,
  price: Number,
  image: String,
  description: String,
  order: Number,
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
  }],
  applicable: {
    end: String,
    time: { start: String, end: String },
    days: [Number],
  },
});

const campaignModel = mongoose.model("campaign", campaignSchema);

export default campaignModel;
