// controllers/authController.js

import User from "../models/User.js";
import jwt from "jsonwebtoken";

// 🔐 Generate JWT
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    }
  );
};

// 🔑 Change Password
export const changePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("+password");

    const { currentPassword, newPassword } = req.body;

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Missing fields",
      });
    }

    const isMatch =
      await user.matchPassword(currentPassword);

    if (!isMatch) {
      return res.status(400).json({
        message: "Current password incorrect",
      });
    }

    user.password = newPassword;
    user.mustChangePassword = false;

    await user.save();

    res.json({
      message: "Password updated successfully",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// 👤 Register User
export const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Missing fields",
      });
    }

    const normalizedEmail =
      email.toLowerCase().trim();

    const userExists = await User.findOne({
      email: normalizedEmail,
    });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const user = await User.create({
      name,
      email: normalizedEmail,
      password,
      role: role || "student",
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      mustChangePassword:
        user.mustChangePassword,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// 🔐 Login User
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Missing credentials",
      });
    }

    // ✅ INCLUDE PASSWORD
    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    }).select("+password");

    if (
      user &&
      (await user.matchPassword(password))
    ) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        mustChangePassword:
          user.mustChangePassword,
        token: generateToken(user._id),
      });

    } else {
      res.status(401).json({
        message: "Invalid credentials",
      });
    }

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};