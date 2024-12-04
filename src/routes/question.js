const express = require("express");
const router = express.Router();
const questionController = require("../controllers/questionController");

router.get("/get-all-question", questionController.getAllQuestion);
router.get(
  "/get-all-question-by-subject/:subjectId",
  questionController.getAllQuestionBySubject
);
router.post("/create-new-question", questionController.createNewQuestion);
router.post(
  "/create-new-questions-from-file",
  questionController.createNewQuestionsFromFile
);

module.exports = router;
