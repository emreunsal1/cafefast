import { Request, Response } from "express";
import { updateCompanyValidator } from "../models/company";
import { getCompany, updateCompany } from "../services/company";
import { getMenu } from "../services/menu";

export const getCompanyController = async (req: Request, res: Response) => {
  const { company } = req.user;

  const { data: companyData, error: companyError } = await getCompany({ query: { _id: company } });
  if (companyError) {
    return res.status(400).send(companyError);
  }

  res.send(companyData);
};

export const getActiveMenuController = async (req: Request, res: Response) => {
  const { companyId } = req.params;
  const { data: companyData, error: companyError } = await getCompany({ query: { _id: companyId } });
  if (companyError) {
    return res.status(400).send(companyError);
  }

  const { data, error } = await getMenu(companyData?.activeMenu);

  if (error) {
    return res.status(400).send(error);
  }

  res.send(data);
};

export const updateCompanyController = async (req: Request, res: Response) => {
  const { company } = req.user;
  try {
    const validatedCompany = await updateCompanyValidator.parseAsync(req.body);
    const result = await updateCompany({ _id: company }, validatedCompany);

    res.send(result);
    return;
  } catch (error) {
    res.status(400).send({ error });
  }
};
