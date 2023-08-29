import { config } from "dotenv";
import bcrypt from "bcrypt";

config();

export const validateCompanyHasProducts = async (companyData, productIds) => {
  try {
    const hasInvalid = productIds.some((id) => !companyData?.products?.includes(id));
    return !hasInvalid;
  } catch (error) {
    return { error };
  }
};

export const createPasswordHash = async (password: string) => bcrypt.hash(password, process.env.COMPANY_USER_PASSWORD_HASH || "123123");

export const verifyPasswordHash = async (inputPassword, userHashedPassword) => bcrypt.compare(inputPassword, userHashedPassword);
