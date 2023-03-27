import mongoose, { Schema } from "mongoose";

const campaignSchema = new Schema({
  price: Number,
  name: String,
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

const menuModel = mongoose.model("campaign", campaignSchema);

export default menuModel;
