import Attendance from "../models/Attendance.js";
import Student from "../models/Student.js";
import mongoose from "mongoose";

// 🔥 Mark Attendance (Teacher/Admin)
export const markAttendance = async (req, res) => {
  try {
    const { studentId, date, status } = req.body;

    if (!studentId || !date || !status) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ message: "Invalid student ID" });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const attendance = await Attendance.create({
      student: studentId,
      date,
      status,
      markedBy: req.user._id,
    });

    res.status(201).json({
      message: "Attendance marked",
      attendance,
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Attendance already marked for this date",
      });
    }

    res.status(500).json({ message: error.message });
  }
};


// 🔥 Get Attendance (Role-based)
export const getAttendance = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === "student") {
      const student = await Student.findOne({ user: req.user._id });

      if (!student) {
        return res.status(404).json({ message: "Student profile not found" });
      }

      query.student = student._id;
    }

    if (req.query.studentId) {
      if (!mongoose.Types.ObjectId.isValid(req.query.studentId)) {
        return res.status(400).json({ message: "Invalid student ID" });
      }
      query.student = req.query.studentId;
    }

    if (req.query.date) {
      const parsedDate = new Date(req.query.date);
      if (isNaN(parsedDate)) {
        return res.status(400).json({ message: "Invalid date" });
      }
      query.date = parsedDate;
    }

    const records = await Attendance.find(query)
      .populate({
        path: "student",
        populate: { path: "user", select: "name email" },
      })
      .populate("markedBy", "name role");

    res.json(records);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};