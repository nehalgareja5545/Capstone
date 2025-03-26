import express from "express";
import {
  createBudget,
  getBudgetsByUserId,
} from "../Controllers/budgetController.js";

const router = express.Router();

router.post("/", createBudget);
router.get("/user/:userId", getBudgetsByUserId);

export default router;
