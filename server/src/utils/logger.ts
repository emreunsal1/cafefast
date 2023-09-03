import { unlink } from "fs";
import { join } from "path";
import winston from "winston";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "info.log" }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(new winston.transports.Console({
    format: winston.format.json(),
  }));
}

export const clearLogs = async () => {
  if (process.env.NODE_ENV !== "production") {
    await unlink(join(__dirname, "../../error.log"), () => {});
    await unlink(join(__dirname, "../../info.log"), () => {});
    logger.info("Log files deleted for development environment");
  }
};

export default logger;
