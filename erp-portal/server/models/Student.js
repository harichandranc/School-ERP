import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // 🔥 replace course + year with class (1–10)
    class: {
      type: Number,
      required: [true, "Class is required"],
      min: 1,
      max: 10,
    },

    section: {
      type: String,
      trim: true,
      default: null,
    },

    rollNumber: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },
  },
  { timestamps: true }
);

// optional: helpful index for school queries
studentSchema.index({ class: 1, section: 1 });

export default mongoose.model("Student", studentSchema);