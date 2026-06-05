import express from "express";
import {
  createAssignment,
  getAssignments,
  getAssignment,
  deleteAssignment,
} from "../controllers/assignmentController.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// 👨‍🏫 Create assignment (Teacher/Admin)
router.post("/", protect, authorizeRoles("teacher", "admin"), createAssignment);

// 📊 Get all assignments (All logged users)
router.get("/", protect, getAssignments);

// 📄 Get single assignment
router.get("/:id", protect, getAssignment);

// ❌ Delete assignment (Admin or creator handled in controller)
router.delete("/:id", protect, deleteAssignment);

export default router;