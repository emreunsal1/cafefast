import { Router } from "express";
import { login, register, logout } from "../controllers/auth";

const route = Router();

route.post("/login", login);
route.post("/register", register);
route.post("/logout", logout);

export default route;
