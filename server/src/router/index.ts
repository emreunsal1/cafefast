import express from "express";
import authRouter from "./auth";
import companyRouter from './company'

const router = express.Router();

router.use("/auth",  authRouter);
router.use("/company", companyRouter)

export default router;
