import z from "zod";
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

export const updateUserVerifier = z.object({
  name: z.string().min(3).max(255).optional(),
  surname: z.string().min(3).max(255).optional(),
});

const userModel = mongoose.model("user", userSchema);

export default userModel;
