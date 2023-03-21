import userModel, { IUser, IUserWithoutPassword } from "../models/user";

export const createUser = async (data: Pick<IUser, "email" | "password" | "phoneNumber">) => {
  try {
    const {
      email, phoneNumber,
    } = data;
    const newUser = await userModel.create({
      email, phoneNumber,
    });
    return { data: newUser };
  } catch (error) {
    return { error };
  }
};

export const checkPhoneOrEmailIsExists = async ({ email, phoneNumber }): Promise<string[] | false> => {
  const result = await userModel.findOne({ $or: [{ email }, { phoneNumber }] });

  if (!result) {
    return false;
  }

  const errors: string[] = [];
  if (result.email === email) {
    errors.push("email");
  }
  if (result.phoneNumber === phoneNumber) {
    errors.push("phoneNumber");
  }
  return errors;
};

export const getUser = async ({ query, populate = false }: {query: Partial<IUser>, populate?: boolean}) => {
  try {
    const mongoQuery = userModel.findOne(query);
    if (populate) {
      mongoQuery.populate("company");
    }
    const data = await mongoQuery.exec();

    return { data };
  } catch (error: Error | unknown) {
    return { error };
  }
};

export const updateUser = async ({ query, data }: {query: Partial<IUser>, data?: Partial<IUserWithoutPassword>}) => {
  try {
    const newUser = await userModel.findOneAndUpdate(query, data, { new: true }).exec();
    return { data: newUser };
  } catch (error: Error | unknown) {
    return { error };
  }
};
