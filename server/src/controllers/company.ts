import { Request, Response } from "express";
import { getCompany } from "../services/company";
import { getUser } from "../services/user";

export const getCompanyController = async (req: Request, res: Response) => {
  const { email } = req.user;
  const { data: userData, error: userError } = await getUser({ query: { email } });

  if (userError || !userData) {
    return res.status(400).send(userError);
  }
  const { data: companyData, error: companyError } = await getCompany(userData.company);

  if (companyError) {
    return res.status(400).send(companyError);
  }

  res.send(companyData);
};
