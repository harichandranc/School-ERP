import Student from "../models/Student.js";
import User from "../models/User.js";
import mongoose from "mongoose";


// 🔥 CREATE STUDENT
export const createStudent = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const { name, email, class: studentClass, section } = req.body;

    if (!name || !email || !studentClass) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existingUser = await User.findOne({ email }).session(session);
    if (existingUser) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "User already exists" });
    }

    const tempPassword = "Temp@123";

    // ✅ Create User
    const [user] = await User.create(
      [
        {
          name,
          email,
          password: tempPassword,
          role: "student",
          mustChangePassword: true,
        },
      ],
      { session }
    );

    // ✅ Create Student
    const [student] = await Student.create(
      [
        {
          user: user._id,
          class: Number(studentClass),
          section: section || null,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    // ✅ IMPORTANT FIX (populate)
    const populatedStudent = await Student.findById(student._id)
      .populate("user", "name email")
      .lean();

    return res.status(201).json({
      message: "Student created successfully",
      student: populatedStudent,
      login: { email, password: tempPassword },
    });

  } catch (error) {
    console.error(error);
    await session.abortTransaction();
    session.endSession();

    return res.status(500).json({ message: error.message });
  }
};


// 🔥 GET ALL STUDENTS (SEARCH + FILTER + PAGINATION)
export const getStudents = async (req, res) => {
  try {
    const { search = "", class: studentClass, page = 1, limit = 10 } = req.query;

    const query = {};

    // 🎯 Filter by class
    if (studentClass) {
      query.class = Number(studentClass);
    }

    // 🔍 Search (name/email via user populate)
    const students = await Student.find(query)
      .populate({
        path: "user",
        select: "name email",
        match: {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        },
      })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .lean();

    // ❗ Remove unmatched (because of populate match)
    const filteredStudents = students.filter((s) => s.user);

    const total = await Student.countDocuments(query);

    res.json({
      data: filteredStudents,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// 🔥 GET SINGLE STUDENT
export const getStudent = async (req, res) => {
  try {
    let student;

    if (req.user.role === "student") {
      student = await Student.findOne({ user: req.user._id })
        .populate("user", "name email")
        .lean();
    } else {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid ID" });
      }

      student = await Student.findById(req.params.id)
        .populate("user", "name email")
        .lean();
    }

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(student);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// 🔥 UPDATE STUDENT
export const updateStudent = async (req, res) => {
  try {
    if (req.user.role !== "admin" && req.user.role !== "teacher") {
      return res.status(403).json({ message: "Access denied" });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const { name, email, class: studentClass, section } = req.body;

    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const user = await User.findById(student.user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Update user
    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;

    await user.save();

    // ✅ Update student
    if (studentClass !== undefined) student.class = Number(studentClass);
    if (section !== undefined) student.section = section;

    await student.save();

    const updatedStudent = await Student.findById(student._id)
      .populate("user", "name email")
      .lean();

    res.json(updatedStudent);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};


// 🔥 DELETE STUDENT
export const deleteStudent = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    if (req.user.role !== "admin") {
      await session.abortTransaction();
      session.endSession();
      return res.status(403).json({ message: "Only admin can delete" });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Invalid ID" });
    }

    const student = await Student.findById(req.params.id).session(session);

    if (!student) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Student not found" });
    }

    await User.findByIdAndDelete(student.user).session(session);
    await student.deleteOne({ session });

    await session.commitTransaction();
    session.endSession();

    res.json({ message: "Student and user deleted successfully" });

  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    res.status(500).json({ message: err.message });
  }
};