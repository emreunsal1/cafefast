import express from "express";
import authRouter from "./auth";
import companyRouter from "./company";
import paymentRouter from "./payment";
import meRouter from "./me";
import locationRouter from "./location";
import menuRouter from "./menu";
import productRouter from "./product";

import { AUTH_REQUIRED_MIDDLEWARE } from "../middleware/jwt";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/location", locationRouter);

router.use("/me", AUTH_REQUIRED_MIDDLEWARE, meRouter);
router.use("/company", AUTH_REQUIRED_MIDDLEWARE, companyRouter);
router.use("/menu", AUTH_REQUIRED_MIDDLEWARE, menuRouter);
router.use("/product", AUTH_REQUIRED_MIDDLEWARE, productRouter);

router.use("/payment", paymentRouter);
export default router;
