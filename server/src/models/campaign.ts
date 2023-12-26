import mongoose, { Schema } from "mongoose";
import z from "zod";

export const createCampaignVerifier = z.object({
  name: z.string().min(3).max(255),
  price: z.number().positive(),
  image: z.string().optional(),
  description: z.string().min(1).max(500),
  products: z.array(z.string()),
  applicable: z.object({
    end: z.date().nullable(),
    time: z.object({
      start: z.string(),
      end: z.string(),
    }).optional(),
    days: z.array(z.number()).optional(),
  }),
});

export const updateCampaignVerifier = createCampaignVerifier.partial();

type ICampaign = z.infer<typeof createCampaignVerifier>

const campaignSchema = new Schema<ICampaign>({
  name: String,
  price: Number,
  image: String,
  description: String,
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
  }],
  applicable: {
    end: { type: String, default: null },
    time: {
      type: {
        start: String,
        end: String,
      },
      default: {
        start: null,
        end: null,
      },
      _id: false,
    },
    days: { type: [Number], default: null },
  },
});

const campaignModel = mongoose.model("campaign", campaignSchema);

export default campaignModel;
