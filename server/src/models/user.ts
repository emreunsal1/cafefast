import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: "string",
  surname: "string",
  email: "string",
  password: "string",
  variant: Number,
}, { timestamps: true });

const userModel = mongoose.model("user", userSchema);

export default userModel;
