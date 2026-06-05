import Assignment from "../models/Assignment.js";
import Student from "../models/Student.js";
import mongoose from "mongoose";

// 🔥 Create Assignment (Teacher/Admin)
export const createAssignment = async (req, res) => {
  try {
    const { title, description, course, dueDate } = req.body;

    if (!title || !course || !dueDate) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const assignment = await Assignment.create({
      title,
      description,
      course,
      dueDate,
      createdBy: req.user._id,
    });

    res.status(201).json({
      message: "Assignment created",
      assignment,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 🔥 Get Assignments (Role-based)
export const getAssignments = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === "student") {
      const student = await Student.findOne({ user: req.user._id });

      if (!student) {
        return res.status(404).json({ message: "Student profile not found" });
      }

      query.course = student.course;
    }

    if (req.query.courseId) {
      if (!mongoose.Types.ObjectId.isValid(req.query.courseId)) {
        return res.status(400).json({ message: "Invalid course ID" });
      }
      query.course = req.query.courseId;
    }

    const assignments = await Assignment.find(query)
      .populate("course", "name")
      .populate("createdBy", "name role");

    res.json(assignments);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 🔥 Get Single Assignment
export const getAssignment = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const assignment = await Assignment.findById(req.params.id)
      .populate("course", "name")
      .populate("createdBy", "name");

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    res.json(assignment);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 🔥 Delete Assignment (Admin / Creator)
export const deleteAssignment = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    if (
      req.user.role !== "admin" &&
      assignment.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await assignment.deleteOne();

    res.json({ message: "Assignment deleted" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};