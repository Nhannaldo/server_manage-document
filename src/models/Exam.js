const mongoose = require("mongoose");

// Define the Exam schema
const ExamSchema = new mongoose.Schema(
  {
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
  },
  {
    timestamps: true,
  }
);

const Exam = mongoose.model("Exam", ExamSchema);

module.exports = Exam;
