import { Request, Response } from "express";
import { MongooseError } from "mongoose";
import companyModel from "../models/company";

export const updateCompany = async (req: Request, res: Response) => {
  const { email } = req.user;
  const { name, surname, companyName } = req.body;
  try {
    const updatedCompany = await companyModel.findOneAndUpdate({ email }, { name, surname, companyName }, { new: true });
    res.send({ message: "successfully updated", data: updatedCompany });
  } catch (err: MongooseError |unknown) {
    res.status(400);
    if (err instanceof MongooseError) {
      console.log("err :>> ", err);
      res.send({ message: err.message });
      return;
    }
    res.send({
      error: err,
    });
    console.log("err :>> ", err);
  }
};
