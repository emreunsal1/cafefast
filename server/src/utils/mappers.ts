import { IUser } from "../models/user";

export const userMapperWithoutPassword = (userData: IUser) => ({
  email: userData.email,
  name: userData.name,
  surname: userData.surname,
  company: userData.company,
  role: userData.role,
});
