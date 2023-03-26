import express from "express";
import authRouter from "./auth";
import companyRouter from "./company";
import paymentRouter from "./payment";
import meRouter from "./me";
import addressRouter from "./address";
import menuRouter from "./menu";

import { AUTH_REQUIRED_MIDDLEWARE } from "../middleware/jwt";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/company", AUTH_REQUIRED_MIDDLEWARE, companyRouter);
router.use("/me", AUTH_REQUIRED_MIDDLEWARE, meRouter);
router.use("/payment", paymentRouter);
router.use("/address", addressRouter);
router.use("/menu", menuRouter);

export default router;
