const Question = require("../models/Question");

async function getAllQuestion(req, res) {
  try {
    const allQuestions = await Question.find().populate("subject");
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

// Function to get all questions by subject
const getAllQuestionBySubject = async (req, res) => {
  try {
    const { subjectId } = req.params; // Lấy môn học từ query parameter

    // Kiểm tra nếu subjectId không có giá trị
    if (!subjectId) {
      return res.status(400).json({ message: "Subject ID is required" });
    }

    // Tìm tất cả câu hỏi với môn học cụ thể
    const questions = await Question.find({ subject: subjectId });

    if (!questions || questions.length === 0) {
      return res
        .status(404)
        .json({ message: "No questions found for this subject" });
    }

    return res.status(200).json({ questions });
  } catch (error) {
    console.error("Error fetching questions:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

//update question
async function updateQuestion(req, res) {
  try {
    const { questionId } = req.params;
    const { question, answers, correctAnswer, subject } = req.body;

    // Validate input
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

    // Find and update the question
    const updatedQuestion = await Question.findByIdAndUpdate(
      questionId,
      { question, answers, correctAnswer, subject },
      { new: true }
    );

    if (!updatedQuestion) {
      return res.status(404).json({ message: "Question not found." });
    }

    return res.status(200).json(updatedQuestion);
  } catch (error) {
    console.error("Error updating question:", error);
    return res
      .status(500)
      .json({ message: "Error updating question", error: error.message });
  }
}

async function getQuestionById(req, res) {
  try {
    const { questionId } = req.params;

    // Validate input
    if (!questionId) {
      return res.status(400).json({ message: "Question ID is required." });
    }

    // Find the question by ID
    const question = await Question.findById(questionId).populate("subject");

    if (!question) {
      return res.status(404).json({ message: "Question not found." });
    }

    return res.status(200).json(question);
  } catch (error) {
    console.error("Error fetching question:", error);
    return res
      .status(500)
      .json({ message: "Error fetching question", error: error.message });
  }
}
async function deleteQuestion(req, res) {
  try {
    const { questionId } = req.params;

    // Validate input
    if (!questionId) {
      return res.status(400).json({ message: "Question ID is required." });
    }

    // Find and delete the question
    const deletedQuestion = await Question.findByIdAndDelete(questionId);

    if (!deletedQuestion) {
      return res.status(404).json({ message: "Question not found." });
    }

    return res.status(200).json({ message: "Question deleted successfully." });
  } catch (error) {
    console.error("Error deleting question:", error);
    return res
      .status(500)
      .json({ message: "Error deleting question", error: error.message });
  }
}

module.exports = {
  getAllQuestion,
  createNewQuestion,
  createNewQuestionsFromFile,
  getAllQuestionBySubject,
  updateQuestion,
  getQuestionById,
  deleteQuestion,
};
