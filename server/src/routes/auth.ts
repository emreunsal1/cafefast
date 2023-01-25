import { Router } from "express";
import login from "../services/auth/login";
import register from "../services/auth/register";

const route = Router();

route.post("/", login);
route.post("/register", register);

export default route;
