import { unlink } from "fs";
import { join } from "path";
import winston from "winston";

const getLogger = () => winston.createLogger({
  levels: {
    error: 0,
    warn: 1,
    info: 2,
  },
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.splat(),
    winston.format.json(),
    winston.format.printf((fullLog) => {
      const { action, level, ...otherParams } = fullLog;
      const actionIfExists = action ? ` ${action}` : "";
      const otherParamsAsLog = typeof otherParams.message === "string" ? otherParams : { ...otherParams.message };

      return `${level}${actionIfExists}: ${JSON.stringify(otherParamsAsLog)}`;
    }),
  ),
  transports: [new winston.transports.Console()],
});

// return winston.createLogger({
//   format: winston.format.combine(
//     winston.format.errors({ stack: true }),
//     winston.format.splat(),
//     winston.format.json(),
//   ),
//   transports: [
//     new winston.transports.File({ filename: "error.log", level: "error" }),
//     new winston.transports.File({ filename: "info.log" }),
//   ],
// });

const logger = getLogger();

export const clearLogs = async () => {
  if (process.env.NODE_ENV !== "production") {
    await unlink(join(__dirname, "../../error.log"), () => {});
    await unlink(join(__dirname, "../../info.log"), () => {});
    logger.info("Log files deleted for development environment");
  }
};

export default logger;
