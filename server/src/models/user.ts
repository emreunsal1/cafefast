import mongoose, { ObjectId } from "mongoose";

export type IUser = {
  email: string;
  password: string;
  name: string;
  surname: string;
  role: number;
  company: mongoose.Types.ObjectId
  phoneNumber: ObjectId
};

export type IUserWithoutPassword = Omit<IUser, "password">

const userSchema = new mongoose.Schema<IUser>({
  email: "string",
  password: "string",
  name: "string",
  surname: "string",
  role: {
    type: "number",
    default: 0,
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "company",
  },
}, { timestamps: true });

const userModel = mongoose.model("user", userSchema);

export default userModel;
