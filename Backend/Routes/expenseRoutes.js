// Routes/ExpenseRoutes.js
import express from "express";
import {
  createExpense,
  getExpensesByGroupId,
  getExpensesByUserId,
  getFilteredExpenses,
} from "../controllers/expenseController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { updateProfilePicture } from "../Controllers/updateProfilePicture.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/", createExpense);
router.get("/group/:groupId", getExpensesByGroupId);
router.get("/user/:userId", getExpensesByUserId);
router.get("/filtered/:userId", getFilteredExpenses);
router.post(
  "/api/profile-picture/:userId",
  upload.single("image"),
  updateProfilePicture
);

export default router;
