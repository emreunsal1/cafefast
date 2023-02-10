import { Request, Response } from "express";
import { createCompany, getCompany } from "../services/company";
import { generateJwt } from "../utils/jwt";
import { AUTH_TOKEN_COOKIE_NAME } from "../constants";
import { companyMapperWithoutPassword } from "../utils/mappers";

export const login = async (req:Request, res:Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).send({
        error: "email and password required",
      });
    }

    const findedCompany = await getCompany({ email, password });
    if (!findedCompany) {
      res.status(404).send({ message: "company not found" });
      return;
    }

    const createdJWT = await generateJwt(companyMapperWithoutPassword(findedCompany));

    res.cookie(AUTH_TOKEN_COOKIE_NAME, createdJWT, { httpOnly: !!process.env.ENVIRONMENT });
    res.send(createdJWT);
  } catch (error:any) {
    res.status(401).send({
      success: false,
      errorMessage: error.message,
    });
  }
};

export const register = async (req:Request, res:Response) => {
  try {
    const {
      name, surname, email, password, companyName,
    } = req.body;

    const response = await createCompany({
      name, surname, email, password, companyName,
    });
    res.send(response);
  } catch (error:any) {
    res.status(401).send({
      success: false,
      errorMessage: error.message,
    });
  }
};
