import { Request, Response } from "express";
import { updateCompanyValidator } from "../models/company";
import { getCompany, updateCompany } from "../services/company";
import { getUser } from "../services/user";

export const getCompanyController = async (req: Request, res: Response) => {
  const { email } = req.user;
  const { data: userData, error: userError } = await getUser({ query: { email } });

  if (userError || !userData) {
    return res.status(400).send(userError);
  }
  const { data: companyData, error: companyError } = await getCompany({ query: { _id: userData.company } });
  if (companyError) {
    return res.status(400).send(companyError);
  }

  res.send(companyData);
};

export const updateCompanyController = async (req: Request, res: Response) => {
  const { company } = req.user;
  try {
    const validatedCompany = await updateCompanyValidator.parseAsync(req.body);
    const result = await updateCompany({ _id: company }, validatedCompany);

    res.send(result);
    return;
  } catch (error) {
    res.send(400).send({ error });
  }
};
