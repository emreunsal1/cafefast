import createCompany from "../services/company/create";

export const login = (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new Error("email and password required");
    }
    res.send(true);
  } catch (error:any) {
    res.status(401).send({
      success: false,
      errorMessage: error.message,
    });
  }
};

export const register = (req, res) => {
  const {
    name, surname, email, password, companyName,
  } = req.body;

  const response = createCompany({
    name, surname, email, password, companyName,
  });
  console.log(response);

  res.send("succes");
};
