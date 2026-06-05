import express from "express";
import {
  registerUser,
  loginUser,
  changePassword,
} from "../controllers/authController.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔐 Login
router.post("/login", loginUser);

// 👤 Register (Admin only)
router.post("/register", registerUser);

// 🔑 Change password (logged-in user)
router.put("/change-password", protect, changePassword);

export default router;