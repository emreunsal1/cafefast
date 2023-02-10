import mongoose, { ObjectId } from "mongoose";

export type IUser = {
  company: ObjectId
  name: string;
  surname: string;
  email: string;
  password: string;
  variant: number;
};

export type IUserWithoutPassword = Omit<IUser, "password">

const userSchema = new mongoose.Schema<IUser>({
  name: "string",
  surname: "string",
  email: "string",
  password: "string",
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "company",
  },
  variant: Number,
}, { timestamps: true });

const userModel = mongoose.model("user", userSchema);

export default userModel;
