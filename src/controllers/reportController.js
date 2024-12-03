const Report = require("../models/Report");

async function getAllReport(req, res) {
  try {
    const allReports = await Report.find();
    return res.status(200).json(allReports);
  } catch (error) {
    console.error("Error fetching Reports:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching Reports" });
  }
}

async function createNewReport(req, res) {
  try {
    const { documentId, userId, reason } = req.body;
    // Create and save the new Report
    const newReport = new Report({
      documentId,
      userId,
      reason,
      createdAt: new Date(),
    });
    await newReport.save();

    // Send success response
    res.status(201).json(newReport);
  } catch (error) {
    // Handle errors
    res.status(500).json({ message: "Error creating Report", error });
  }
}
module.exports = { getAllReport, createNewReport };
