const Subject = require("../models/Subject");

async function getAllSubject(req, res) {
  try {
    const allSubjects = await Subject.find();
    return res.status(200).json(allSubjects);
  } catch (error) {
    console.error("Error fetching Subjects:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching Subjects" });
  }
}

async function createNewSubject(req, res) {
  try {
    const { name } = req.body;

    // Check if name is provided
    if (!name) {
      return res.status(400).json({ message: "Subject name is required." });
    }

    // Create and save the new Subject
    const newSubject = new Subject({ name });
    await newSubject.save();

    // Send success response
    res.status(201).json(newSubject);
  } catch (error) {
    // Handle errors
    res.status(500).json({ message: "Error creating Subject", error });
  }
}
module.exports = { getAllSubject, createNewSubject };
