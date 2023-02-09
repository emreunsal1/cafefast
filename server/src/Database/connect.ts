import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const { DB_URL } = process.env;
mongoose.set("strictQuery", true);

const connectDB = () => {
  mongoose.connect(DB_URL as string).then(() => {
    console.log("Connected to database");
  });
};

export default connectDB;
