import express from "express";
import accountRoutes from "./routes/accountRoutes.js";
import transactionRoutes from "./routes/ransactionRoutes.js";
import transferRoutes from "./routes/transferRoutes.js";
import errorHandler from "./middleware/errorHandler.js";
import { ApiResponse } from "./utils/ApiResponse.js";

import dotenv from "dotenv";
dotenv.config();

import cors from "cors";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
  }),
);

app.get("/ping", (req, res) => {
  const response = new ApiResponse(200, "pong");
  res.status(200).json(response);
});

app.use("/api/accounts", accountRoutes);
app.use("/api/accounts", transactionRoutes);
app.use("/api/transfers", transferRoutes);

app.use(errorHandler);

export default app;
