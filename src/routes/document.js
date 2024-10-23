const express = require("express");
const router = express.Router();
const documentController = require("../controllers/documentController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/get-all-document", documentController.getAllDocument);
router.post("/create-new-document", documentController.createNewDocument);
router.get("/detail/:id", documentController.getDetailDocument);
//search
router.get("/search", documentController.searchDocuments);

//filter page tài liệu môn
router.get("/filter", documentController.filterDocuments);

// upload
router.get(
  "/get-all-document-upload/:userId",
  documentController.getAllDocumentUpload
);

module.exports = router;
