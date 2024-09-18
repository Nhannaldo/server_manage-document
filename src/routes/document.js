const express = require("express");
const router = express.Router();
const documentController = require("../controllers/documentController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/get-all-document", documentController.getAllDocument);
router.post("/create-new-document", documentController.createNewDocument);

//search
router.get("/search", documentController.searchDocuments);

//filter page tài liệu môn
router.get("/filter", documentController.filterDocuments);

module.exports = router;
