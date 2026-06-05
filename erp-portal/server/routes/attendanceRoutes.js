import express from "express";
import {
  markAttendance,
  getAttendance,
} from "../controllers/attendanceController.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// 👨‍🏫 Teacher/Admin marks attendance
router.post("/", protect, authorizeRoles("teacher", "admin"), markAttendance);

// 📊 View attendance (All logged users, role handled in controller)
router.get("/", protect, getAttendance);

export default router;