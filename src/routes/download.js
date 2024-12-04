const express = require("express");
const router = express.Router();
const downloadController = require("../controllers/downloadController");

router.get(
  "/get-all-document-download/:userId",
  downloadController.getAllDocumentDownload
);
router.post("/create-new-download", downloadController.createNewDownload);
router.delete(
  "/delete-document/:documentId",
  downloadController.deleteDownloadDocument
);
module.exports = router;
