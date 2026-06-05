import express from "express";
import {
  createCourse,
  getCourses,
  getCourse,
  deleteCourse,
} from "../controllers/courseController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// ➕ Create course (Admin only)
router.post("/", protect, authorizeRoles("admin"), createCourse);

// 📚 Get all courses (All logged users)
router.get("/", protect, getCourses);

// 📄 Get single course
router.get("/:id", protect, getCourse);

// ❌ Delete course (Admin only)
router.delete("/:id", protect, authorizeRoles("admin"), deleteCourse);

export default router;