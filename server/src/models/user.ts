import z from "zod";
import mongoose from "mongoose";

enum UserRoles {
  ADMIN = 0,
  EMPLOYEE = 1
}

const userVerifier = z.object({
  email: z.string().email(),
  password: z.string().min(3).max(255),
  name: z.string().min(3).max(255),
  surname: z.string().min(3).max(255),
  role: z.nativeEnum(UserRoles),
  company: z.instanceof(mongoose.Schema.Types.ObjectId),
  phoneNumber: z.string().transform((val) => {
    if (Number.isNaN(Number(val)) || val.length !== 10) {
      throw new Error("Phone Number must have 10 digits");
    }
    return val;
  }),
});

type IUser = z.infer<typeof userVerifier>;

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

export const registerUserVerifier = userVerifier.pick({ email: true, password: true });
export const updateUserVerifier = userVerifier.pick({ name: true, surname: true });

const userModel = mongoose.model("user", userSchema);

export default userModel;
