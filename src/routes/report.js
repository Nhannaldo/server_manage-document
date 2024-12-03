const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");

router.get("/get-all-report", reportController.getAllReport);
router.post("/create-new-report", reportController.createNewReport);

module.exports = router;
