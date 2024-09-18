const mongoose = require("mongoose");

const TypeFileSchema = new mongoose.Schema(
  {
    name: { type: String, require: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("TypeFile", TypeFileSchema);
