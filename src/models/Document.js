const mongoose = require("mongoose");

const DocumentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    fileUrl: { type: String, required: true },
    imageUrl: { type: String, required: true },
    typefileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TypeFile",
      required: true,
    },
    pagenumber: { type: Number, require: true },
    views: { type: Number, require: true },
    downloads: { type: Number, require: true },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    // ratings: [
    //   {
    //     userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    //     rating: { type: Number, min: 1, max: 5 },
    //     comment: { type: String },
    //   },
    // ],
    sharedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    uploadedAt: { type: Date, default: Date.now },
    approvedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Document", DocumentSchema);