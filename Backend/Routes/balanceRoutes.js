// Routes/BalanceRoutes.js
import express from "express";
import { getBalance } from "../controllers/balanceController.js";
import { settleGroupBalances } from "../Controllers/settleGroupBalances.js";

const router = express.Router();

router.get("/:groupId", getBalance);
router.post("/settle/:groupId/:userId", settleGroupBalances);

export default router;
