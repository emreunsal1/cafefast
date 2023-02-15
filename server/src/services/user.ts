import userModel, { IUser } from "../models/user";

export const createUser = async (data: IUser) => {
  try {
    const {
      company, email, name, password, role, surname,
    } = data;
    const newUser = await userModel.create({
      company, email, name, password, role, surname,
    });
    return { data: newUser };
  } catch (error) {
    return { error };
  }
};

export const getUser = async (query: Partial<IUser>) => {
  try {
    const data = await userModel.findOne(query).populate("company").exec();
    return { data };
  } catch (error: Error | unknown) {
    return { error };
  }
};
