const express = require("express");
const router = express.Router();
const favoriteController = require("../controllers/favoriteController");

router.get(
  "/get-all-document-favorite/:userId",
  favoriteController.getAllDocumentFavorite
);
router.post("/create-new-favorite", favoriteController.createNewFavorite);
router.delete(
  "/delete-document/:documentId",
  favoriteController.deleteFavoriteDocument
);
module.exports = router;
