import "dotenv/config";
// import "dotenv/config";

import express from "express";
import cookieParser from "cookie-parser";
import { connectDB } from "./db/db.js";

import userRouter from "./router/user.router.js";

const PORT = 3000;

const app = express();

app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());

app.use("/api/user", userRouter);

app.get("/", (req, res) => {
  return res.send("<h1>Running </h1>");
});

await connectDB();

app.listen(PORT, () => {
  console.log("Server is running on PORT:", PORT);
});
