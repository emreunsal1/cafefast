import dotenv from "dotenv";
import express from "express";
import router from "./router";

dotenv.config();

const app = express();

app.use("/", router);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`);
});
