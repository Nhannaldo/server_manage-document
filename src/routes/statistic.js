const express = require("express");
const router = express.Router();
const statisticController = require("../controllers/statisticController");

router.get("/get-all-statistic", statisticController.getAllStatistic);

router.get(
  "/get-upload-download-statistic",
  statisticController.getUploadDownloadStatistic
);
module.exports = router;
