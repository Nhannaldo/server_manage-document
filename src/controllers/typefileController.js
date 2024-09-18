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
module.exports = { getAllTypeFile, createNewTypeFile };
