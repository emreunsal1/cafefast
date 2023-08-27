import { Request, Response } from "express";
import { createCompanyValidator } from "../models/company";
import { updateUserVerifier } from "../models/user";
import { createCompany } from "../services/company";
import { getUser, updateUser } from "../services/user";
import { validateCityAndDistrict } from "../utils/address";

export const getMeController = async (req: Request, res: Response) => {
  const { email } = req.user;
  try {
    const { data, error } = await getUser({ query: { email }, populate: true });
    if (error) {
      res.status(401).send({ error });
      return;
    }
    res.send(data);
  } catch (error) {
    res.status(401).send({ error });
  }
};

export const updateMeController = async (req: Request, res: Response) => {
  const { email } = req.user;
  try {
    const data = await updateUserVerifier.parseAsync(req.body);
    const { data: newUser, error } = await updateUser({ query: { email }, data });
    if (error) {
      return res.send(400).send({ error });
    }
    return res.send(newUser);
  } catch (err) {
    res.status(400).send({ error: err });
  }
};

export const completeOnboardingController = async (req: Request, res: Response) => {
  const { email } = req.user;
  const { company, user } = req.body;
  try {
    const parsedCompany = await createCompanyValidator.parseAsync(company);
    const parsedUser = await updateUserVerifier.parseAsync(user);
    const cityValidationResult = validateCityAndDistrict(parsedCompany.address.city, parsedCompany.address.district);

    if (cityValidationResult !== "valid") {
      return res.status(400).send({
        message: "please send a valid city and district",
        field: cityValidationResult,
      });
    }

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
