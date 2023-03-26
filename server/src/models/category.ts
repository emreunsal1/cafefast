import mongoose, { Schema } from "mongoose";

const categorySchema = new Schema({
  name: String,
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
    default: [],
  }],
  image: String,
  order: Number,
});

const menuModel = mongoose.model("category", categorySchema);

export default menuModel;
