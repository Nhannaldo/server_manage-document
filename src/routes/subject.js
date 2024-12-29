const express = require("express");
const router = express.Router();
const subjectController = require("../controllers/subjectController");

router.get("/get-all-subject", subjectController.getAllSubject);
router.post("/create-new-subject", subjectController.createNewSubject);

router.get("/get-subject/:id", subjectController.getSubjectById);
router.put("/update-subject/:id", subjectController.updateSubject);
router.delete("/delete-subject/:id", subjectController.deleteSubject);
module.exports = router;
