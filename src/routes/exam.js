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

router.put("/update-exam/:examId", examController.updateExamById);
router.delete("/delete-exam/:examId", examController.deleteExamById);
module.exports = router;
