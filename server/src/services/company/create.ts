import companyModel from "../../models/company";
import { ICreateCompany } from "../../utils/interfaces/company";

const createCompany = async (data:ICreateCompany) => {
  const {
    name, surname, companyName, email, password,
  } = data;

  const newCompany = await companyModel.create({
    name, surname, email, password, companyName,
  });

  return newCompany;
};

export default createCompany;
