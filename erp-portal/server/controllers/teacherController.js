import Teacher from "../models/Teacher.js";
import User from "../models/User.js";
import mongoose from "mongoose";


// ================= CREATE TEACHER =================
export const createTeacher = async (req, res) => {
  console.log("Teacher Create Body:", req.body);
  const session = await mongoose.startSession();
  
  try {
    session.startTransaction();

    const {
      name,
      email,
      assignedClass,
      assignedSection,
    } = req.body;

    if (
      !name ||
      !email ||
      !assignedClass
    ) {
      await session.abortTransaction();
      session.endSession();

      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    const existingUser =
      await User.findOne({ email }).session(session);

    if (existingUser) {
      await session.abortTransaction();
      session.endSession();

      return res.status(400).json({
        message: "User already exists",
      });
    }

    const tempPassword = "Temp@123";

    const [user] = await User.create(
      [
        {
          name,
          email,
          password: tempPassword,
          role: "teacher",
          mustChangePassword: true,
        },
      ],
      { session }
    );

    const [teacher] = await Teacher.create(
      [
        {
          user: user._id,
          assignedClass,
          assignedSection,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      message: "Teacher created successfully",
      teacher,
      login: {
        email,
        password: tempPassword,
      },
    });

  } catch (error) {
    console.error("CREATE TEACHER ERROR:", error);

    await session.abortTransaction();
    session.endSession();

    return res.status(500).json({
      message: error.message,
    });
  }
};


// ================= GET ALL TEACHERS =================
export const getTeachers = async (
  req,
  res
) => {
  try {
    const teachers = await Teacher.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(teachers);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// ================= GET MY PROFILE =================
export const getTeacher = async (
  req,
  res
) => {
  try {

    const teacher =
      await Teacher.findOne({
        user: req.user._id,
      }).populate(
        "user",
        "name email role"
      );

    if (!teacher) {
      return res.status(404).json({
        message: "Teacher not found",
      });
    }

    res.json(teacher);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// ================= UPDATE =================
export const updateTeacher =
  async (req, res) => {

    try {

      const teacher =
        await Teacher.findById(
          req.params.id
        ).populate("user");

      if (!teacher) {
        return res.status(404).json({
          message: "Teacher not found",
        });
      }

      if (req.body.name) {
        teacher.user.name =
          req.body.name;

        await teacher.user.save();
      }

      if (
        req.body.assignedClass
      ) {
        teacher.assignedClass =
          req.body.assignedClass;
      }

      if (
        req.body.assignedSection
      ) {
        teacher.assignedSection =
          req.body.assignedSection;
      }

      await teacher.save();

      const updated =
        await Teacher.findById(
          teacher._id
        ).populate(
          "user",
          "name email"
        );

      res.json(updated);

    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };


// ================= DELETE =================
export const deleteTeacher =
  async (req, res) => {

    const session =
      await mongoose.startSession();

    try {

      session.startTransaction();

      const teacher =
        await Teacher.findById(
          req.params.id
        ).session(session);

      if (!teacher) {
        await session.abortTransaction();
        session.endSession();

        return res.status(404).json({
          message: "Teacher not found",
        });
      }

      await User.findByIdAndDelete(
        teacher.user
      ).session(session);

      await Teacher.findByIdAndDelete(
        teacher._id
      ).session(session);

      await session.commitTransaction();
      session.endSession();

      res.json({
        message:
          "Teacher deleted successfully",
      });

    } catch (error) {

      await session.abortTransaction();
      session.endSession();

      res.status(500).json({
        message: error.message,
      });
    }
  };