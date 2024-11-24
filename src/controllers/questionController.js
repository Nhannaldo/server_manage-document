const Question = require("../models/Question");

async function getAllQuestion(req, res) {
  try {
    const allQuestions = await Question.find();
    return res.status(200).json(allQuestions);
  } catch (error) {
    console.error("Error fetching Questions:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching Questions" });
  }
}

async function createNewQuestion(req, res) {
  try {
    const { question, answers, correctAnswer, subject } = req.body;

    // Check if question, answers, and correctAnswer are provided and valid
    if (!question) {
      return res.status(400).json({ message: "Question text is required." });
    }

    if (!Array.isArray(answers) || answers.length < 2) {
      return res
        .status(400)
        .json({ message: "Answers array must contain at least two answers." });
    }

    if (
      typeof correctAnswer !== "number" ||
      correctAnswer < 0 ||
      correctAnswer >= answers.length
    ) {
      return res
        .status(400)
        .json({ message: "Correct answer index is invalid." });
    }

    // Check if a question with the same text already exists
    const existingQuestion = await Question.findOne({ question });
    if (existingQuestion) {
      return res
        .status(400)
        .json({ message: "Question with the same text already exists." });
    }
    // Create and save the new Question
    const newQuestion = new Question({
      question,
      answers,
      correctAnswer,
      subject,
    });
    await newQuestion.save();

    // Send success response
    res.status(201).json(newQuestion);
  } catch (error) {
    // Handle errors
    res
      .status(500)
      .json({ message: "Error creating Question", error: error.message });
  }
}
module.exports = { getAllQuestion, createNewQuestion };
