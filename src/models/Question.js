const mongoose = require("mongoose");

// Define the Question schema
const QuestionSchema = new mongoose.Schema(
  {
    question: { type: String, required: true }, // The question text
    answers: { type: [String], required: true }, // Array of possible answers
    correctAnswer: { type: Number, required: true }, // Index of the correct answer in the answers array
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create the Question model
const Question = mongoose.model("Question", QuestionSchema);

module.exports = Question;
