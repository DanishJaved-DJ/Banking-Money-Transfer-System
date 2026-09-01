import express from "express";
import accountRoutes from "./routes/accountRoutes.js";
import transactionRoutes from "./routes/ransactionRoutes.js";
import transferRoutes from "./routes/transferRoutes.js";

import dotenv from "dotenv";
dotenv.config();

import cors from "cors";

const app = express();
app.use(express.json());
app.use(
    cors({
        origin: process.env.FRONTEND_URL
    })
);



app.get("/ping", (req, res) => {
   res.status(200).json({ message: "pong" });
});

app.use("/api/accounts", accountRoutes);
app.use("/api/accounts", transactionRoutes);

app.use("/api/transfers", transferRoutes);

export default app;

