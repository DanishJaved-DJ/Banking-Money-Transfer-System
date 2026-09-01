import express from "express";

import {
    transfer
} from "../controllers/transferController.js";

const router = express.Router();

router.post("/", transfer);

export default router;