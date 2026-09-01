import express from "express";
import { createAccount , getBalance } from "../controllers/accountController.js";

const router = express.Router();

router.post("/", createAccount);
router.get("/:accountId/balance", getBalance);

export default router;