import express from "express";
import accountRoutes from "./routes/accountRoutes.js";

import dotenv from "dotenv";
dotenv.config();


const app = express();
app.use(express.json());


app.get("/ping", (req, res) => {
   res.status(200).json({ message: "pong" });
});

app.use("/api/accounts", accountRoutes);

export default app;

