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

async function createNewQuestionsFromFile(req, res) {
  try {
    const { questions } = req.body;

    if (!questions || questions.length === 0) {
      return res.status(400).json({ message: "Không có câu hỏi để tạo." });
    }

    // Lặp qua từng câu hỏi và tạo mới trong cơ sở dữ liệu
    const createdQuestions = [];

    for (const questionData of questions) {
      const { question, answers, correctAnswer, subject } = questionData;

      // Kiểm tra xem câu hỏi đã tồn tại chưa
      const existingQuestion = await Question.findOne({ question });
      if (existingQuestion) {
        return res
          .status(400)
          .json({ message: `Câu hỏi "${question}" đã tồn tại.` });
      }

      // Tạo câu hỏi mới
      const newQuestion = new Question({
        question,
        answers,
        correctAnswer,
        subject,
      });
      await newQuestion.save();
      createdQuestions.push(newQuestion);
    }

    return res.status(201).json({
      message: "Câu hỏi đã được tạo thành công!",
      questions: createdQuestions,
    });
  } catch (error) {
    console.error("Error creating questions:", error);
    return res
      .status(500)
      .json({ message: "Lỗi khi tạo câu hỏi từ file.", error: error.message });
  }
}

module.exports = {
  getAllQuestion,
  createNewQuestion,
  createNewQuestionsFromFile,
};
