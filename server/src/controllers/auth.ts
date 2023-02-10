import { Request, Response } from "express";
import { createCompany, getCompany } from "../services/company";
import { generateJwt } from "../middleware/jwt";

export const login = async (req:Request, res:Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).send({
        error: "email and password required",
      });
    }

    const response = await getCompany({ email, password });
    const createdJWT = await generateJwt({ email });
    res.cookie("userToken", createdJWT, { httpOnly: !!process.env.ENVIRONMENT });
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
