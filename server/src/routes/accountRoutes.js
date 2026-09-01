import express from "express";
import { createAccount , getBalance , getAllAccounts } from "../controllers/accountController.js";

const router = express.Router();

router.post("/", createAccount);
router.get("/", getAllAccounts);
router.get("/:accountId/balance", getBalance);

export default router;