// Routes/ExpenseRoutes.js
import express from "express";
import {
  createExpense,
  getExpensesByGroupId,
  getExpensesByUserId,
  getFilteredExpenses,
} from "../controllers/expenseController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", createExpense);
router.get("/group/:groupId", getExpensesByGroupId);
router.get("/user/:userId", getExpensesByUserId);
router.get("/filtered/:userId", getFilteredExpenses);

export default router;
