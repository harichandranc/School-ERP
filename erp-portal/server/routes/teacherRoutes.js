import express from "express";

import {
  createTeacher,
  getTeachers,
  getTeacher,
  updateTeacher,
  deleteTeacher,
} from "../controllers/teacherController.js";

import {
  protect,
  authorizeRoles,
} from "../middleware/authMiddleware.js";

const router = express.Router();


// Teacher Self
router.get(
  "/me",
  protect,
  authorizeRoles("teacher"),
  getTeacher
);


// Admin Routes
router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  createTeacher
);

router.get(
  "/",
  protect,
  authorizeRoles("admin"),
  getTeachers
);

router.put(
  "/:id",
  protect,
  authorizeRoles("admin"),
  updateTeacher
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  deleteTeacher
);

export default router;