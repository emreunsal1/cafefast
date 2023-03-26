import { Request, Response } from "express";
import { generateJwt } from "../utils/jwt";
import { AUTH_TOKEN_COOKIE_NAME } from "../constants";
import { checkUserFieldIsExists, createUser, getUser } from "../services/user";
import { registerUserVerifier } from "../models/user";
import { mapUserForJWT } from "../utils/mappers";

export const login = async (req:Request, res:Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).send({
        error: "email and password required",
      });
    }

    const findedUser = await getUser({
      query: { email, password },
    });

    if (findedUser.error || !findedUser.data) {
      res.status(400).send({ error: findedUser.error });
      return;
    }

    const createdJWT = await generateJwt(mapUserForJWT(findedUser.data));
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
      email,
      password,
    } = req.body;

    const parsedUser = await registerUserVerifier.parseAsync({ email, password });
    const isExists = await checkUserFieldIsExists({ email: parsedUser.email });

    if (Array.isArray(isExists)) {
      res.status(400).json({
        error: {
          message: "exists",
          fields: isExists,
        },
      });
      return;
    }
    const createdUser = await createUser(parsedUser);
    if (createdUser.error) {
      res.status(400).json(createdUser.error);
      return;
    }
    const createdJWT = await generateJwt(mapUserForJWT(createdUser.data));
    res.cookie(AUTH_TOKEN_COOKIE_NAME, createdJWT, { httpOnly: !!process.env.ENVIRONMENT }).send({ token: createdJWT });
    res.status(201).json(createdUser.data);
  } catch (error:any) {
    res.status(401).json({
      error,
    });
  }
};
