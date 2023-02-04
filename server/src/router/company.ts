import { Router } from "express";
import { update } from "../controllers/company";
import { verifyJWT } from '../middleware/jwt';

const route = Router();



route.post("/update", verifyJWT ,(req,res)=>{
  res.send("success");
});

export default route;
