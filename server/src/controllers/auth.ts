export const login = (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);
    res.send("succsess");
  } catch (error) {
    res.send("not success");
  }
};

export const register = (req, res) => {};
