import { Request, Response } from "express";

const getCompanyController = (req: Request, res: Response) => {
  const { company: companyId } = req.user;
};
