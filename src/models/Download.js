const mongoose = require("mongoose");
const DownloadSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  downloadDocuments: [
    {
      documentId: { type: mongoose.Schema.Types.ObjectId, ref: "Document" },
      downloadAt: { type: Date, default: Date.now },
      _id: false,
    },
  ],
});

module.exports = mongoose.model("Download", DownloadSchema);
