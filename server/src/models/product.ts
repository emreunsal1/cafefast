import mongoose, { Schema } from "mongoose";

const productSchema = new Schema({
  price: Number,
  name: String,
  description: String,
  images: [String],
  attributes: [{ name: String, price: Number }],
  requiredAttributeCount: { type: Number, default: 0 },
  inStock: { type: Boolean, default: true },
});

const menuModel = mongoose.model("product", productSchema);

export default menuModel;
