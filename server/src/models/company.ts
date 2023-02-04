import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
  name: "string",
  surname: "string",
  companyName: "string",
  email: "string",
  password: "string",
  isDeleted: {
    type:Boolean,
    default:false
  },
});

const companyModel = mongoose.model("company", companySchema);

export default companyModel;
