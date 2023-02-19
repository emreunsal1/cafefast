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

    const findedUser = await getUser({ email, password });
    if (findedUser.error || !findedUser.data) {
      res.status(400).send({ error: findedUser.error });
      return;
    }

    const createdJWT = await generateJwt(userMapperWithoutPassword(findedUser.data));
    res.cookie(AUTH_TOKEN_COOKIE_NAME, createdJWT, { httpOnly: !!process.env.ENVIRONMENT }).send({ token: createdJWT });
  } catch (error:any) {
    res.status(400).send({
      error,
    });
  }
};

export const register = async (req:Request, res:Response) => {
  try {
    const {
      companyName,
      email,
      password,
      name,
      surname,
      phoneNumber,
    } = req.body;

    const createdCompany = await createCompany({ name: companyName });
    if (createdCompany.error || !createdCompany.data) {
      res.status(400).json(createdCompany.error);
      return;
    }
    const createdUser = await createUser({
      company: createdCompany.data._id,
      role: 0,
      email,
      password,
      name,
      surname,
      phoneNumber,
    });
    if (createdUser.error) {
      res.status(400).json(createdUser.error);
      return;
    }
    res.status(201).json(createdUser.data);
  } catch (error:any) {
    res.status(401).json({
      error,
    });
  }
};
