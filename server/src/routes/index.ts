import express from "express";
import authRouter from "./auth";

const router = express.Router();

router.post("/auth", authRouter);

module.exports = { router };
