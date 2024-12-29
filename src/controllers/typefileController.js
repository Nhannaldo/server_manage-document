const TypeFile = require("../models/TypeFile");

async function getAllTypeFile(req, res) {
  try {
    const allTypeFiles = await TypeFile.find();
    return res.status(200).json(allTypeFiles);
  } catch (error) {
    console.error("Error fetching TypeFiles:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching TypeFiles" });
  }
}

async function createNewTypeFile(req, res) {
  try {
    const { name } = req.body;

    // Check if name is provided
    if (!name) {
      return res.status(400).json({ message: "TypeFile name is required." });
    }

    // Create and save the new TypeFile
    const newTypeFile = new TypeFile({ name });
    await newTypeFile.save();

    // Send success response
    res.status(201).json(newTypeFile);
  } catch (error) {
    // Handle errors
    res.status(500).json({ message: "Error creating TypeFile", error });
  }
}
async function getTypeFileById(req, res) {
  try {
    const { id } = req.params;
    const typeFile = await TypeFile.findById(id);

    if (!typeFile) {
      return res.status(404).json({ message: "TypeFile not found." });
    }

    res.status(200).json(typeFile);
  } catch (error) {
    res.status(500).json({ message: "Error fetching TypeFile", error });
  }
}

async function updateTypeFile(req, res) {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const updatedTypeFile = await TypeFile.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );

    if (!updatedTypeFile) {
      return res.status(404).json({ message: "TypeFile not found." });
    }

    res.status(200).json(updatedTypeFile);
  } catch (error) {
    res.status(500).json({ message: "Error updating TypeFile", error });
  }
}

async function deleteTypeFile(req, res) {
  try {
    const { id } = req.params;

    const deletedTypeFile = await TypeFile.findByIdAndDelete(id);

    if (!deletedTypeFile) {
      return res.status(404).json({ message: "TypeFile not found." });
    }

    res.status(200).json({ message: "TypeFile deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error deleting TypeFile", error });
  }
}

module.exports = {
  getAllTypeFile,
  createNewTypeFile,
  getTypeFileById,
  updateTypeFile,
  deleteTypeFile,
};
