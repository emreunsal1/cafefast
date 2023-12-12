import { unlink } from "fs";
import { join } from "path";
import winston from "winston";

const getLogger = () => {
  if (process.env.NODE_ENV !== "production") {
    return winston.createLogger({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf((fullLog) => {
          const { action, level, ...otherParams } = fullLog;
          const actionIfExists = action ? ` ${action}` : "";
          return `${level}${actionIfExists}: ${JSON.stringify(otherParams)}`;
        }),
      ),
      transports: [new winston.transports.Console()],
    });
  }

  return winston.createLogger({
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
};

const logger = getLogger();

export const clearLogs = async () => {
  if (process.env.NODE_ENV !== "production") {
    await unlink(join(__dirname, "../../error.log"), () => {});
    await unlink(join(__dirname, "../../info.log"), () => {});
    logger.info("Log files deleted for development environment");
  }
};

export default logger;
