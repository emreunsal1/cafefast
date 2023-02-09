import mongoose from "mongoose";
import dotenv from "dotenv";

const connectDB = async () => {
  dotenv.config();
  const { DB_URL } = process.env;
  mongoose.set("strictQuery", true);
  try {
    await mongoose.connect(DB_URL as string);
    console.log("Connected to database");
  } catch (err) {
    console.log("Error while connecting to database => ", err);
  }
};

export default connectDB;
