const express = require("express");
const router = express.Router();
const questionController = require("../controllers/questionController");

router.get("/get-all-question", questionController.getAllQuestion);
router.post("/create-new-question", questionController.createNewQuestion);

module.exports = router;
