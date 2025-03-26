// Routes/BalanceRoutes.js
import express from "express";
import { getBalance } from "../controllers/balanceController.js";

const router = express.Router();

router.get("/:groupId", getBalance);

export default router;
