import express from "express";
import authRouter from "./auth";
import companyRouter from "./company";
import paymentRouter from "./payment";
import meRouter from "./me";

import { AUTH_REQUIRED_MIDDLEWARE } from "../middleware/jwt";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/company", AUTH_REQUIRED_MIDDLEWARE, companyRouter);
router.use("/me", AUTH_REQUIRED_MIDDLEWARE, meRouter);
router.use("/payment", paymentRouter);

export default router;
