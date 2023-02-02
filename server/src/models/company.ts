import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
  companyName: "string",
  name: "string",
  surname: "string",
  email: "string",
  password: "string",
});

const companyModel = mongoose.model("company", companySchema);

export default companyModel;
