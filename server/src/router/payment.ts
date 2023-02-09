import { Router } from "express";
import paymentMethod from "../controllers/payment";

const route = Router();

route.post("/:id", paymentMethod);

export default route;
