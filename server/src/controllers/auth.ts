import { Request, Response } from "express";
import { generateJwt, setCookie } from "../utils/jwt";
import { AUTH_TOKEN_COOKIE_NAME } from "../constants";
import { checkUserFieldIsExists, createUser, getUser } from "../services/user";
import { registerUserVerifier } from "../models/user";
import { mapUserForJWT } from "../utils/mappers";
import { createPasswordHash, verifyPasswordHash } from "../utils/company";

export const login = async (req:Request, res:Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(401).send({
        error: "email and password required",
      });
    }

    const findedUser = await getUser({
      query: { email },
      withPassword: true,
    });

    if (findedUser.error || !findedUser.data) {
      res.status(401).send({ error: findedUser.error });
      return;
    }

    const isHashSuccessfull = await verifyPasswordHash(password, findedUser.data.password);
    if (!isHashSuccessfull) {
      return res.status(401).send("Unauthorized");
    }

    const createdJWT = await generateJwt(mapUserForJWT(findedUser.data));
    setCookie(res, AUTH_TOKEN_COOKIE_NAME, createdJWT as string);
    res.send();
  } catch (error:any) {
    res.status(401).send({
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
      return res.status(401).json({
        error: {
          message: "exists",
          fields: isExists,
        },
      });
    }

    const hashedPassword = await createPasswordHash(parsedUser.password);
    const newUser = {
      email: parsedUser.email,
      password: hashedPassword,
    };

    const createdUser = await createUser(newUser);
    if (createdUser.error) {
      return res.status(401).json(createdUser.error);
    }
    const createdJWT = await generateJwt(mapUserForJWT(createdUser.data));
    setCookie(res, AUTH_TOKEN_COOKIE_NAME, createdJWT as string);
    res.status(201).send();
  } catch (error:any) {
    res.status(401).json({
      error,
    });
  }
};

export const logout = async (_req:Request, res:Response) => {
  res.clearCookie(AUTH_TOKEN_COOKIE_NAME).status(201).send("Successfully logout");
};
