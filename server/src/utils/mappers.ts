import { IUser, updateUserVerifier } from "../models/user";

export const updateMeMapper = (userData: IUser) => {
  try {
    const data = updateUserVerifier.parse(userData);
    return { data };
  } catch (error) {
    return { error };
  }
};

export const mapUserForJWT = (userData) => ({
  email: userData.email,
  _id: userData._id,
});
