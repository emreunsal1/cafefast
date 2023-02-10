import { IUser } from "../models/user";

export const companyMapperWithoutPassword = (userData: IUser) => ({
  email: userData.email,
  password: userData.password,
  name: userData.name,
  surname: userData.surname,
  variant: userData.variant,
});
