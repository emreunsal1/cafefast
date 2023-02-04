import getCompany from "../services/company/get";
import createCompany from "../services/company/create";
import express  from 'express';


export const login = async (req:express.Request, res:express.Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new Error("email and password required");
    }
    const response = await getCompany({email,password});
    res.send(response);
  } catch (error:any) {
    res.status(401).send({
      success: false,
      errorMessage: error.message,
    });
  }
};

export const register = async (req:express.Request, res:express.Response) => {
try {
  const {
    name, surname, email, password, companyName,
  } = req.body;

  const response = await createCompany({
    name, surname, email, password, companyName,
  });
  res.send(response); 
} catch (error:any) {
  res.status(401).send({
    success: false,
    errorMessage: error.message,
  });
}

};
