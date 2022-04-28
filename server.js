//TODO add email verification
//TODO add OAuth2.0
//TODO add update email functionality
//TODO add delete user functionality

import express from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import auth from "./routes/api/v1/auth.js";
import refresh from "./routes/api/v1/refresh.js";
import connectDB from "./helpers/connectDB.js";

const app = express();

config();
connectDB();

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (_, res) => {
  res.status(200).json({ version: process.env.VERSION });
});

app.use("/api/v1/auth", auth);
app.use("/api/v1/refresh", refresh);

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`server running at port ${port}`);
});
