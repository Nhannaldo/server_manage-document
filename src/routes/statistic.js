const express = require("express");
const router = express.Router();
const statisticController = require("../controllers/statisticController");

router.get("/get-all-statistic", statisticController.getAllStatistic);

module.exports = router;
