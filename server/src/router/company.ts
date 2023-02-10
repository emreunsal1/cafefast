import { Router } from "express";
import { updateCompany } from "../controllers/company";

const route = Router();

route.post("/update", updateCompany);

export default route;
