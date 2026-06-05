import express from "express";
import {
  submitAssignment,
  getSubmissions,
  gradeSubmission,
} from "../controllers/submissionController.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// 📥 student submit
router.post("/", protect, authorizeRoles("student"), submitAssignment);

// 📄 teacher/admin view
router.get("/", protect, authorizeRoles("teacher", "admin"), getSubmissions);

// 📊 grade
router.put("/:id", protect, authorizeRoles("teacher", "admin"), gradeSubmission);

export default router;