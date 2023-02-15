import mongoose, { Schema } from "mongoose";

const productSchema = [
  {
    price: Number,
    name: String,
    description: String,
    images: [String],
    attributes: [{ name: String, price: Number }],
    inStock: { type: Boolean, default: true },
  }];

const campaignsSchema = [{
  price: Number,
  name: String,
  image: String,
  description: String,
  order: Number,
  productIds: [Schema.Types.ObjectId],
  applicable: {
    end: String,
    time: { start: String, end: String },
    days: [Number],
  },
}];

const categoriesSchema = [{
  name: String,
  products: [{ id: Schema.Types.ObjectId, order: Number }],
  image: String,
  order: Number,
}];

const menuSchema = new Schema({
  companyId: Schema.Types.ObjectId,
  campaigns: campaignsSchema,
  categories: categoriesSchema,
  products: productSchema,
});

const menuModel = mongoose.model("menu", menuSchema);

export default menuModel;
