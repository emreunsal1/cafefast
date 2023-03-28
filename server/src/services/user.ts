import userModel, { IUser } from "../models/user";

export const createUser = async (data: Pick<IUser, "email" | "password">) => {
  try {
    const newUser = await userModel.create(data);

    return { data: newUser };
  } catch (error) {
    return { error: (error as any).message || error };
  }
};

export const checkUserFieldIsExists = async (data: Partial<IUser>): Promise<string[] | false> => {
  const query = Object.keys(data).map((key) => ({
    [key]: data[key],
  }));
  const result = await userModel.findOne({ $or: query });
  if (!result) {
    return false;
  }

  const errors: string[] = [];
  Object.keys(data).forEach((field) => {
    if (result[field] === data[field]) {
      errors.push(field);
    }
  });
  return errors;
};

export const getUser = async ({
  query, populate = false,
  withPassword = false,
}: {query: Partial<IUser>, populate?: boolean, withPassword?: boolean}) => {
  try {
    const mongoQuery = userModel.findOne(query);
    if (populate) {
      mongoQuery.populate("company");
    }
    if (!withPassword) {
      mongoQuery.select("-password");
    }
    const data = await mongoQuery.exec();

    if (!data) {
      return { error: "User not found" };
    }
    return { data };
  } catch (error: Error | unknown) {
    return { error: (error as any).message || error };
  }
};

export const updateUser = async ({ query, data }: {query: Partial<IUser>, data?: Partial<IUser>}) => {
  try {
    const newUser = await userModel.findOneAndUpdate(query, data, { new: true }).select("-password").exec();
    return { data: newUser };
  } catch (error: Error | unknown) {
    return { error: (error as any).message || error };
  }
};
