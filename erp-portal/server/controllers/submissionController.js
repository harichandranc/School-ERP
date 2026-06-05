import Submission from "../models/Submission.js";
import Student from "../models/Student.js";
import Assignment from "../models/Assignment.js";

// 📥 Student submits assignment
export const submitAssignment = async (req, res) => {
  try {
    const { assignment, textAnswer, fileUrl } = req.body;

    if (!assignment) {
      return res.status(400).json({ message: "Assignment required" });
    }

    // ✅ check assignment exists
    const assignmentDoc = await Assignment.findById(assignment);

    if (!assignmentDoc) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    // ✅ check status (simple control)
    if (assignmentDoc.status === "closed") {
      return res.status(400).json({ message: "Submission closed" });
    }

    const student = await Student.findOne({ user: req.user._id });

    if (!student) {
      return res.status(404).json({ message: "Student profile not found" });
    }

    const submission = await Submission.create({
      assignment,
      student: req.user._id,
      textAnswer,
      fileUrl,
    });

    res.status(201).json(submission);

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Already submitted" });
    }

    res.status(500).json({ message: error.message });
  }
};


// 📄 Get submissions (filtered)
export const getSubmissions = async (req, res) => {
  try {
    const { assignmentId } = req.query;

    const filter = assignmentId ? { assignment: assignmentId } : {};

    const submissions = await Submission.find(filter)
      .populate("student", "name email")
      .populate("assignment");

    res.json(submissions);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 📊 Grade submission
export const gradeSubmission = async (req, res) => {
  try {
    const { grade, feedback } = req.body;

    const submission = await Submission.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    submission.grade = grade;
    submission.feedback = feedback;

    await submission.save();

    res.json(submission);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};