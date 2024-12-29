const express = require("express");
const router = express.Router();
const questionController = require("../controllers/questionController");

router.get("/get-all-question", questionController.getAllQuestion);
router.get(
  "/get-all-question-by-subject/:subjectId",
  questionController.getAllQuestionBySubject
);
router.get(
  "/get-question-by-id/:questionId",
  questionController.getQuestionById
);
router.post("/create-new-question", questionController.createNewQuestion);
router.post(
  "/create-new-questions-from-file",
  questionController.createNewQuestionsFromFile
);
router.put("/update-question/:questionId", questionController.updateQuestion);
router.delete(
  "/delete-question/:questionId",
  questionController.deleteQuestion
);
module.exports = router;
