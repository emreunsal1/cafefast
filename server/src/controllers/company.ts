import { Request, Response } from "express";
import { companyDesksValidator, updateCompanyValidator } from "../models/company";
import {
  getCompany, getDesks, updateCompany, updateCompanyDesks,
} from "../services/company";
import { getMenu } from "../services/menu";
import { getOrders } from "../services/order";
import { mapOrders } from "../utils/mappers";

export const getCompanyController = async (req: Request, res: Response) => {
  const { company } = req.user;

  const { data: companyData, error: companyError } = await getCompany({ query: { _id: company } });
  if (companyError) {
    return res.status(400).send(companyError);
  }

  res.send(companyData);
};

export const getCompanyOrdersController = async (req: Request, res: Response) => {
  try {
    const { company } = req.user;
    const { data: ordersData, error: ordersError } = await getOrders(company);

    if (ordersError || !ordersData) {
      return res.status(400).send(ordersError);
    }
    const orders = mapOrders(ordersData);

    res.send(orders);
  } catch (error: any) {
    res.send({
      error: error?.message || error,
    });
  }
};

export const getCompanyDesksController = async (req: Request, res: Response) => {
  try {
    const { company } = req.user;
    const { data: desks, error: desksError } = await getDesks(company);

    if (desksError || !desks) {
      return res.status(400).send(desksError);
    }

    res.send(desks);
  } catch (error: any) {
    res.send({
      error: error?.message || error,
    });
  }
};

export const updateCompanyDesksController = async (req: Request, res: Response) => {
  try {
    const { company } = req.user;
    const { desks } = req.body;

    const validatedDesks = await companyDesksValidator.parseAsync(desks);
    const { data: updatedDesksResult, error: updateDesksError } = await updateCompanyDesks(company, validatedDesks);

    if (updateDesksError || !updatedDesksResult) {
      return res.status(400).send(updateDesksError);
    }

    res.send(updatedDesksResult.desks);
  } catch (error: any) {
    res.send({
      error: error?.message || error,
    });
  }
};

export const clearCompanyDesksController = async (req: Request, res: Response) => {
  try {
    const { company } = req.user;
    const { data: desks, error: desksError } = await updateCompanyDesks(company, []);

    if (desksError || !desks) {
      return res.status(400).send(desksError);
    }

    res.send(desks);
  } catch (error: any) {
    res.send({
      error: error?.message || error,
    });
  }
};

export const getActiveMenuController = async (req: Request, res: Response) => {
  const { companyId } = req.params;
  const { data: companyData, error: companyError } = await getCompany({ query: { _id: companyId } });
  if (companyError) {
    return res.status(400).send(companyError);
  }

  const { data, error } = await getMenu(companyData?.activeMenu);

  if (error || !data) {
    return res.status(404).send({ message: "active menu not found", error });
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
