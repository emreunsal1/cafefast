export const login = (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new Error("email and password required");
    }
    return res.send(true);
  } catch (error:any) {
    res.status(401).send({
      success: false,
      errorMessage: error.message,
    });
  }
};

export const register = (req, res) => {};
