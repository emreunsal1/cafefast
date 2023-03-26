import { Router } from "express";
import { completeOnboardingController, getMeController, updateMeController } from "../controllers/me";

const route = Router();

route.get("/", getMeController);
route.put("/", updateMeController);
route.post("/complete-onboarding", completeOnboardingController);

export default route;
