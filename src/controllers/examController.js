const Exam = require("../models/Exam");
// Function to create a new exam
const createNewExam = async (req, res) => {
  try {
    const { subjectId, questions } = req.body;

    // Create a new Exam document
    const exam = new Exam({
      subjectId,
      questions,
    });

    // Save the exam to the database
    await exam.save();

    res.status(201).json(exam);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Function to get all exams
const getAllExam = async (req, res) => {
  try {
    // Retrieve all exams and populate subject and questions references
    const exams = await Exam.find().populate("subjectId").populate("questions");

    res.status(200).json(exams);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Function to get all exams by subjectId
const getAllExamBySubject = async (req, res) => {
  try {
    const { subjectId } = req.params;

    // Find exams by subjectId and populate subject and questions references
    const exams = await Exam.find({ subjectId })
      .populate("subjectId")
      .populate("questions");

    res.status(200).json(exams);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getExamById = async (req, res) => {
  try {
    const { examId } = req.params;
    const exam = await Exam.findById(examId)
      .populate("subjectId")
      .populate("questions");

    if (!exam) {
      return res.status(404).send("Exam not found");
    }

    res.status(200).json(exam);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};

// Function to update an exam by ID
const updateExamById = async (req, res) => {
  try {
    const { examId } = req.params;
    const { subjectId, questions } = req.body;

    // Find the exam by ID and update it
    const exam = await Exam.findByIdAndUpdate(
      examId,
      { subjectId, questions },
      { new: true, runValidators: true }
    )
      .populate("subjectId")
      .populate("questions");

    if (!exam) {
      return res.status(404).send("Exam not found");
    }

    res.status(200).json(exam);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Function to delete an exam by ID
const deleteExamById = async (req, res) => {
  try {
    const { examId } = req.params;

    // Find the exam by ID and delete it
    const exam = await Exam.findByIdAndDelete(examId);

    if (!exam) {
      return res.status(404).send("Exam not found");
    }

    res.status(200).send("Exam deleted successfully");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = {
  createNewExam,
  getAllExam,
  getAllExamBySubject,
  getExamById,
  updateExamById,
  deleteExamById,
};
