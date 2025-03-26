// Routes/GroupRoutes.js
import express from "express";
import {
  addMembersToGroup,
  createGroup,
  getGroupById,
  getUserGroups,
} from "../Controllers/groupController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", createGroup);
router.get("/:userId", getUserGroups);
router.get("/groupDetails/:groupId", getGroupById);
router.put("/:groupId/addMembers", addMembersToGroup);

export default router;
