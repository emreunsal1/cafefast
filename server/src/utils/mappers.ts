import { IUser, updateUserVerifier } from "../models/user";

export const userMapperWithoutPassword = (userData: IUser) => ({
  email: userData.email,
  name: userData.name,
  surname: userData.surname,
  company: userData.company,
  role: userData.role,
});

export const updateMeMapper = (userData: IUser) => {
  try {
    const data = updateUserVerifier.parse(userData);
    return { data };
  } catch (error) {
    return { error };
  }
};
