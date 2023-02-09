import { Router } from "express";

const route = Router();

route.post("/update", (req, res) => {
  res.send("success");
});

export default route;
