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
  documentController.getAllDocumentUploadUser
);

//admin
router.get(
  "/get-all-document-uploaded",
  documentController.getAllDocumentUploaded
);
router.get(
  "/get-all-document-pending",
  documentController.getAllDocumentPending
);
router.get("/get-document/:id", documentController.getDocumentById);

router.put("/approve-document/:id", documentController.ApproveDocumentId);
router.put("/reject-document/:id", documentController.RejectDocumentId);
module.exports = router;
