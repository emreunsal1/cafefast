import { Request, Response } from "express";
import { generateJwt } from "../utils/jwt";
import { AUTH_TOKEN_COOKIE_NAME } from "../constants";
import { userMapperWithoutPassword } from "../utils/mappers";
import { createUser, getUser } from "../services/user";
import { IUser } from "../models/user";
import { createCompany } from "../services/company";

export const login = async (req:Request, res:Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).send({
        error: "email and password required",
      });
    }

    const findedCompany = await getUser({ email, password });
    if (findedCompany.error || !findedCompany.data) {
      res.status(400).send({ error: findedCompany.error });
      return;
    }

    const createdJWT = await generateJwt(userMapperWithoutPassword(findedCompany.data));
    res.cookie(AUTH_TOKEN_COOKIE_NAME, createdJWT, { httpOnly: !!process.env.ENVIRONMENT }).send(createdJWT);
  } catch (error:any) {
    res.status(400).send({
      error,
    });
  }
};

interface IRegisterUser extends Omit<IUser, "role" | "company"> {
  companyName: string
}

export const register = async (req:Request<any, any, IRegisterUser>, res:Response) => {
  try {
    const {
      companyName,
      email,
      password,
      name,
      surname,
      phoneNumber,
    } = req.body;

    const createdCompany = await createCompany({ companyName });
    if (!createdCompany.error && createdCompany.data) {
      const response = await createUser({
        company: createdCompany.data._id,
        role: 0,
        email,
        password,
        name,
        surname,
        phoneNumber,
      });
      res.send(response);
      return;
    }
    res.status(400).send({ error: createdCompany.error });
  } catch (error:any) {
    res.status(401).send({
      success: false,
      errorMessage: error.message,
    });
  }
};
