import express from "express";
import authRouter from "./auth";
import companyRouter from "./company";
import paymentRouter from "./payment";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/company", companyRouter);
router.use("/payment", paymentRouter);

export default router;
