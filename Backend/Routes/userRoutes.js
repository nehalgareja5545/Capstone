import express from "express";
import {
  getUserById,
  getUserByEmail,
  searchUsers,
} from "../Controllers/userController.js";
import { getNotificationsByUserId } from "../Controllers/getNotificationsByUserId.js";
import { deleteNotification } from "../Controllers/deleteNotification.js";

const router = express.Router();

router.get("/userid/:userId", getUserById);
router.get("/email/:email", getUserByEmail);
router.get("/search", searchUsers);
router.get("/notifications/:userId", getNotificationsByUserId);
router.delete("/notifications/:id", deleteNotification);

export default router;
