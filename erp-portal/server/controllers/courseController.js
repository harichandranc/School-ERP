import Course from "../models/Course.js";
import mongoose from "mongoose";

// 🔥 Create Course
export const createCourse = async (req, res) => {
  try {
    const { name, code } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Course name is required" });
    }

    const existing = await Course.findOne({ name: name.trim() });
    if (existing) {
      return res.status(400).json({ message: "Course already exists" });
    }

    const course = await Course.create({
      name: name.trim(),
      code,
    });

    res.status(201).json(course);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// 🔥 Get All Courses
export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.json(courses);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// 🔥 Get Single Course
export const getCourse = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json(course);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// 🔥 Delete Course
export const deleteCourse = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    await course.deleteOne();

    res.json({ message: "Course deleted" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};