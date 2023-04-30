import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import router from "./router";
import connectDB from "./database/connect";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ credentials: true, origin: ["http://localhost:3000", "http://localhost:3001"] }));
app.use(cookieParser());
app.use("/", router);

connectDB();

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`);
});
