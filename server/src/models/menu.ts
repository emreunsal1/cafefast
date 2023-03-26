import mongoose, { Schema } from "mongoose";

const menuSchema = new Schema({
  campaigns: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "campaign",
    default: [],
  }],
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "category",
    default: [],
  }],
  products: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
    default: [],
  },
});

const menuModel = mongoose.model("menu", menuSchema);

export default menuModel;
