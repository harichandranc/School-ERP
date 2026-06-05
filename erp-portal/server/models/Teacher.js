import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    assignedClass: {
      type: Number,
      required: true,
    },

    assignedSection: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Teacher = mongoose.model(
  "Teacher",
  teacherSchema
);

export default Teacher;