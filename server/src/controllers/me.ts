import { Request, Response } from "express";
import { createCompanyValidator } from "../models/company";
import { updateUserVerifier } from "../models/user";
import { createCompany } from "../services/company";
import { getUser, updateUser } from "../services/user";
import { updateMeMapper } from "../utils/mappers";

export const getMeController = async (req: Request, res: Response) => {
  const { email } = req.user;
  const { data, error } = await getUser({ query: { email }, populate: true });

  if (error) {
    res.status(400).send({ error });
    return;
  }
  res.send(data);
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
  res.send(data);
};

export const completeOnboardingController = async (req: Request, res: Response) => {
  const { email } = req.user;
  const { company, user } = req.body;
  try {
    const parsedCompany = await createCompanyValidator.parseAsync(company);
    const parsedUser = await updateUserVerifier.parseAsync(user);

    const { data: createdCompany } = await createCompany(parsedCompany);
    const { data: newUser } = await updateUser({
      query: { email },
      data: {
        ...parsedUser,
        company: createdCompany?._id,
      },
    });

    return res.send({
      message: "user updated",
      data: newUser,
    });
  } catch (err) {
    console.log("[completeOnboardingController] :>> ", err);
    res.status(400).send({ error: err });
  }
};
