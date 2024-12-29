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

async function getSubjectById(req, res) {
  try {
    const { id } = req.params;
    const subject = await Subject.findById(id);

    if (!subject) {
      return res.status(404).json({ message: "Subject not found." });
    }

    return res.status(200).json(subject);
  } catch (error) {
    console.error("Error fetching Subject:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching the Subject" });
  }
}

async function updateSubject(req, res) {
  try {
    const { id } = req.params;
    const { name } = req.body;

    // Check if name is provided
    if (!name) {
      return res.status(400).json({ message: "Subject name is required." });
    }

    const updatedSubject = await Subject.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );

    if (!updatedSubject) {
      return res.status(404).json({ message: "Subject not found." });
    }

    return res.status(200).json(updatedSubject);
  } catch (error) {
    console.error("Error updating Subject:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while updating the Subject" });
  }
}

async function deleteSubject(req, res) {
  try {
    const { id } = req.params;
    const deletedSubject = await Subject.findByIdAndDelete(id);

    if (!deletedSubject) {
      return res.status(404).json({ message: "Subject not found." });
    }

    return res.status(200).json({ message: "Subject deleted successfully." });
  } catch (error) {
    console.error("Error deleting Subject:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while deleting the Subject" });
  }
}

module.exports = {
  getAllSubject,
  createNewSubject,
  getSubjectById,
  updateSubject,
  deleteSubject,
};
