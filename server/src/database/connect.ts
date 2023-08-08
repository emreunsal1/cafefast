import mongoose from "mongoose";
import dotenv from "dotenv";
import logger from "../utils/logger";

const connectDB = async () => {
  dotenv.config();
  const { DB_URL } = process.env;
  mongoose.set("strictQuery", true);
  try {
    await mongoose.connect(DB_URL as string);
    logger.info({ message: "Connected to MongoDB" });
  } catch (err) {
    logger.error({ message: "Error when connecting database", stack: err });
  }
};

export default connectDB;
