import Redis from "ioredis";
import { config } from "dotenv";
import logger from "../utils/logger";

config();

let redis: Redis;

export const connectToRedis = async () => {
  try {
    redis = new Redis(process.env.REDIS_URL as string);
    await redis.get("init");
    logger.info("Connected to redis");
  } catch (err) {
    logger.error("Error when connecting redis");
  }
};

export const getRedis = () => redis;
