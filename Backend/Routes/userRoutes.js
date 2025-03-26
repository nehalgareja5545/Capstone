import express from "express";
import {
  getUserById,
  getUserByEmail,
  searchUsers,
} from "../Controllers/userController.js";

const router = express.Router();

router.get("/userid/:userId", getUserById);
router.get("/email/:email", getUserByEmail);
router.get("/search", searchUsers);

export default router;
