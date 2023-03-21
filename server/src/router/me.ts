import { Router } from "express";
import { getMeController, updateMeController } from "../controllers/me";

const route = Router();

route.get("/", getMeController);
route.put("/", updateMeController);

export default route;
