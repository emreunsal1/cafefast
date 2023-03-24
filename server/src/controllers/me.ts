import { Request, Response } from "express";
import { IUser } from "../models/user";
import { getUser, updateUser } from "../services/user";
import { updateMeMapper, userMapperWithoutPassword } from "../utils/mappers";

export const getMeController = async (req: Request, res: Response) => {
  const { email } = req.user;
  const { data, error } = await getUser({ query: { email }, populate: true });
  console.log("error", error);

  if (error) {
    res.status(400).send({ error });
    return;
  }
  res.send(userMapperWithoutPassword(data as IUser));
};

export const updateMeController = async (req: Request, res: Response) => {
  const { email } = req.user;
  const result = updateMeMapper(req.body);
  const { data, error } = await updateUser({ query: { email }, data: result.data });

  if (error || result.error) {
    const currentError = error || result.error;
    res.status(400).send({ error: currentError });
    return;
  }
  res.send(userMapperWithoutPassword(data as any));
};
