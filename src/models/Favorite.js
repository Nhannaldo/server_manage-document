const mongoose = require("mongoose");
const FavoriteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  favoriteDocuments: [
    {
      documentId: { type: mongoose.Schema.Types.ObjectId, ref: "Document" },
      favoritedAt: { type: Date, default: Date.now },
      _id: false,
    },
  ],
});

module.exports = mongoose.model("Favorite", FavoriteSchema);
