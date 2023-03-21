import { Request, Response } from "express";
import { generateJwt } from "../utils/jwt";
import { AUTH_TOKEN_COOKIE_NAME } from "../constants";
import { userMapperWithoutPassword } from "../utils/mappers";
import { checkPhoneOrEmailIsExists, createUser, getUser } from "../services/user";

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
      populate: false,
    });

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
      email,
      password,
      phoneNumber,
    } = req.body;

    const isExists = await checkPhoneOrEmailIsExists({ email, phoneNumber });

    if (Array.isArray(isExists)) {
      res.status(400).json({
        error: {
          message: "exists",
          fields: isExists,
        },
      });
      return;
    }
    const createdUser = await createUser({
      email,
      phoneNumber,
      password,
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
