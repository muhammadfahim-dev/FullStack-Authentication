import express, { json } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

// express middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "16kb" }));
app.use(express.static("./public"));
app.use(cookieParser());
// app.use(
//   cors({
//     origin: process.env.CORS_ORIGN,
//     credentials: true,
//   })
// );

// routes import
import userRouter from "./routes/user.routes.js";

// register routes
app.use("/api/v1/user", userRouter);

export default app;
