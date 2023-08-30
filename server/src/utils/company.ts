import { config } from "dotenv";
import bcrypt from "bcrypt";

config();

export const validateCompanyHasProducts = (companyData, productIds) => {
  try {
    const hasInvalid = productIds.some((id) => !companyData?.products?.includes(id));
    return !hasInvalid;
  } catch (error) {
    return { error };
  }
};

export const createPasswordHash = async (password: string) => {
  const round = process.env.SALT_ROUND || 41;
  const salt = await bcrypt.genSalt(Number(round));
  return bcrypt.hash(password, salt);
};

export const verifyPasswordHash = async (inputPassword, userHashedPassword) => bcrypt.compare(inputPassword, userHashedPassword);
