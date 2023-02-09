import express from "express";
import authRouter from "./auth";
import companyRouter from "./company";
import paymentRouter from "./payment";

import { verifyJWT } from "../middleware/jwt";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/company", verifyJWT, companyRouter);
router.use("/payment", paymentRouter);

export default router;
