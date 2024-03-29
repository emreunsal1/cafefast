import express, { Request, Response } from "express";
import { ZodError } from "zod";
import authRouter from "./auth";
import companyRouter from "./company";
import paymentRouter from "./payment";
import meRouter from "./me";
import locationRouter from "./location";
import menuRouter from "./menu";
import productRouter from "./product";
import basketRouter from "./basket";
import imageRouter from "./image";
import campaignRouter from "./campaign";

import { AUTH_REQUIRED_MIDDLEWARE } from "../middleware/jwt";
import { getActiveMenuController } from "../controllers/company";

const router = express.Router();
router.get("/", (_, res) => res.send({ ready: "to fly 🚀" }));

// ADMIN ROUTES START
router.use("/auth", authRouter);
router.use("/location", locationRouter);
router.use("/me", AUTH_REQUIRED_MIDDLEWARE, meRouter);
router.use("/company", AUTH_REQUIRED_MIDDLEWARE, companyRouter);
router.use("/menu", AUTH_REQUIRED_MIDDLEWARE, menuRouter);
router.use("/campaigns", AUTH_REQUIRED_MIDDLEWARE, campaignRouter);
router.use("/product", AUTH_REQUIRED_MIDDLEWARE, productRouter);
// ADMIN ROUTES END

// USER ROUTES START
router.get("/active-menu/:companyId", getActiveMenuController);
router.use("/basket", basketRouter);
router.use("/payment", paymentRouter);
// USER ROUTES END

router.use("/image", imageRouter);

export default router;
