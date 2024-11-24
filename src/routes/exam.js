const express = require("express");
const router = express.Router();
const examController = require("../controllers/examController");

router.get(
  "/get-all-exam-subject/:subjectId",
  examController.getAllExamBySubject
);
router.post("/create-new-exam", examController.createNewExam);
router.get("/get-all-exam", examController.getAllExam);
router.get("/get-exam/:examId", examController.getExamById);

module.exports = router;
