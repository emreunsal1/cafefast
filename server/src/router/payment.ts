import { Router } from "express";
import { continue3dPaymentController, render3dPageCountroller, start3dPaymentController } from "../controllers/payment";

const route = Router();

route.post("/:id", start3dPaymentController);
route.post("/3d-continue", continue3dPaymentController);
route.post("/3d-start", render3dPageCountroller);

export default route;
