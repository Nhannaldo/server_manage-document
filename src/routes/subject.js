const express = require("express");
const router = express.Router();
const subjectController = require("../controllers/subjectController");

router.get("/get-all-subject", subjectController.getAllSubject);
router.post("/create-new-subject", subjectController.createNewSubject);

module.exports = router;
