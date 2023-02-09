import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import router from "./router";
import connectDB from "./database/connect";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use("/", router);

connectDB();

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`);
});
