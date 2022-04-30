//TODO add email verification
//TODO add password reset using email

//TODO implement frontend

//TODO use private and public key instead of plain secret
//TODO use async await insted of then catch
//TODO use TS instead of JS
//TODO add OAuth2.0

import express from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import connectDB from "./helpers/connectDB.js";

import auth from "./routes/api/v1/auth.js";
import refresh from "./routes/api/v1/refresh.js";
import user from "./routes/api/v1/user.js";
import verify from "./routes/api/v1/verify.js";

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
app.use("/api/v1/user", user);
app.use("/api/v1/verify", verify);

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`server running at port ${port}`);
});
