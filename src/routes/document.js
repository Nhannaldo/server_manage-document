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
router.get("/filterlesson", documentController.filterDocumentLessons);
router.get("/filtertopic", documentController.filterDocumentTopics);

// upload
router.get(
  "/get-all-document-upload/:userId",
  documentController.getAllDocumentUploadUser
);

//calculate views
router.post("/increase-view", documentController.IncreaseView);

//admin
router.post(
  "/create-new-document-admin",
  documentController.createNewDocumentAdmin
);
router.put("/update-document/:id", documentController.updateDocumentById);

router.get(
  "/get-all-document-uploaded",
  documentController.getAllDocumentUploaded
);
router.get(
  "/get-all-document-rejected",
  documentController.getAllDocumentRejected
);
router.get(
  "/get-all-document-pending",
  documentController.getAllDocumentPending
);
router.get("/get-document/:id", documentController.getDocumentById);

router.put("/approve-document/:id", documentController.ApproveDocumentId);
router.put("/reject-document/:id", documentController.RejectDocumentId);
router.put("/canceled-document/:id", documentController.CancelDocumentId);

router.get("/top-documents", documentController.getTopDocuments);
router.get(
  "/documents-by-category-document/",
  documentController.getDocumentsByCategoryDocument
);
router.get(
  "/documents-by-category-lesson/",
  documentController.getDocumentsByCategoryLesson
);
router.get(
  "/documents-by-category-topic/",
  documentController.getDocumentsByCategoryTopic
);
module.exports = router;
