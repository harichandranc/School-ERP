import express from "express";

import {
  createStudent,
  getStudents,
  getStudent,
  updateStudent,
  deleteStudent,
} from "../controllers/studentController.js";

import {
  protect,
  authorizeRoles,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// CREATE
router.post(
  "/",
  protect,
  authorizeRoles("admin", "teacher"),
  createStudent
);

// GET ALL
router.get(
  "/",
  protect,
  authorizeRoles("admin", "teacher"),
  getStudents
);

// GET SINGLE
router.get(
  "/:id",
  protect,
  authorizeRoles(
    "admin",
    "teacher",
    "student"
  ),
  getStudent
);

// UPDATE
router.put(
  "/:id",
  protect,
  authorizeRoles("admin", "teacher"),
  updateStudent
);

// DELETE
router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  deleteStudent
);

export default router;