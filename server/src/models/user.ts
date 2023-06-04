import z from "zod";
import mongoose from "mongoose";

export type IUser = {
  email: string;
  password: string;
  name: string;
  surname: string;
  role: number;
  company: mongoose.Types.ObjectId
  phoneNumber: string
};

export type IUserWithoutPassword = Omit<IUser, "password">

const userSchema = new mongoose.Schema<IUser>({
  email: String,
  password: String,
  name: String,
  surname: String,
  role: {
    type: Number,
    default: 0,
  },
  phoneNumber: String,
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "company",
  },
}, { timestamps: true });

export const registerUserVerifier = z.object({
  email: z.string().min(3).max(255),
  password: z.string().min(3).max(255),
  phoneNumber: z.string().transform((val) => {
    if (Number.isNaN(Number(val)) || val.length !== 10) {
      throw new Error("Phone Number must have 10 digits");
    }
    return val;
  }).optional(),
});

export const updateUserVerifier = registerUserVerifier.partial();

const userModel = mongoose.model("user", userSchema);

export default userModel;
