import dotenv from "dotenv";
import http from "http";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import router from "./router";
import connectDB from "./database/connect";
import logger, { clearLogs } from "./utils/logger";
import { createSocketServer } from "./utils/socket";

const app = express();

const init = async () => {
  dotenv.config();
  await clearLogs();
  await connectDB();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors({ credentials: true, origin: ["http://localhost:3000", "http://localhost:3001"] }));
  app.use(cookieParser());
  app.use("/", router);

  const port = process.env.PORT || 4000;
  const server = http.createServer(app);
  createSocketServer(server);

  server.listen(port, () => logger.info({ message: `App is running on http://localhost:${port}` }));
};

init();
