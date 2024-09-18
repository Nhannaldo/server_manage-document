const Document = require("../models/Document");
const TypeFile = require("../models/TypeFile");
const Subject = require("../models/Subject");
const mongoose = require("mongoose");

async function getAllDocument(req, res) {
  try {
    const allDocuments = await Document.find();
    return res.status(200).json(allDocuments);
  } catch (error) {
    console.error("Error fetching documents:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching documents" });
  }
}

async function createNewDocument(req, res) {
  try {
    const {
      title,
      description,
      categoryId,
      subjectId,
      fileUrl,
      imageUrl,
      typefileId,
      pagenumber,
      views,
      downloads,
      uploadedBy,
      status,
    } = req.body;

    // Validate required fields
    if (
      !title ||
      !categoryId ||
      !subjectId ||
      !fileUrl ||
      !typefileId ||
      !pagenumber ||
      !views ||
      !downloads ||
      !uploadedBy
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Create a new document
    const newDocument = new Document({
      title,
      description,
      categoryId,
      subjectId,
      fileUrl,
      imageUrl,
      typefileId,
      pagenumber,
      views,
      downloads,
      uploadedBy,
      status, // Defaults to 'pending' if not provided
    });

    // Save the document to the database
    await newDocument.save();

    // Send success response
    res.status(201).json(newDocument);
  } catch (error) {
    // Handle errors
    res.status(500).json({ message: "Error creating document", error });
  }
}

// Search documents by title
const searchDocuments = async (req, res) => {
  const { q } = req.query; // Get the search term from query parameters

  if (!q) {
    return res.status(400).json({ message: "Title is required for search" });
  }

  try {
    // Perform a case-insensitive search using a regular expression
    const documents = await Document.find({
      title: { $regex: q, $options: "i" }, // 'i' makes the search case-insensitive
    });

    // Return the matching documents
    res.status(200).json(documents);
  } catch (error) {
    res.status(500).json({ message: "Error occurred while searching", error });
  }
};

const filterDocuments = async (req, res) => {
  try {
    const { subjectNames, typefileId, pageCountRange, sortBy } = req.query;

    console.log("Query parameters:", req.query);

    // Build filter object
    let filter = {};

    // Find typefileId by name if provided
    if (typefileId) {
      const typefile = await TypeFile.findOne({ name: typefileId });
      if (typefile) filter.typefileId = typefile._id;
    }
    // Lọc theo subjectNames
    if (subjectNames) {
      const subjects = subjectNames.split(",");
      const subjectIds = await Subject.find({ name: { $in: subjects } }).select(
        "_id"
      );
      filter.subjectId = { $in: subjectIds.map((subject) => subject._id) };
    }
    // Filter by page count range
    if (pageCountRange) {
      const [minPage, maxPage] = pageCountRange.split("-");
      if (maxPage) {
        filter.pagenumber = {
          $gte: parseInt(minPage),
          $lte: parseInt(maxPage),
        };
      } else {
        filter.pagenumber = { $gte: parseInt(minPage) }; // For "50 pages or more"
      }
    }

    // Sorting
    let sortOptions = {};
    if (sortBy === "newest") {
      sortOptions.uploadedAt = -1; // Sort by newest
    } else if (sortBy === "mostViewed") {
      sortOptions.views = -1; // Sort by most viewed
    } else if (sortBy === "mostDownloaded") {
      sortOptions.downloads = -1; // Sort by most downloaded
    }

    // Fetch documents with filtering and sorting
    const documents = await Document.find(filter)
      .populate("typefileId", "name")
      .populate("subjectId", "name") // Thêm populate cho subjectId
      .sort(sortOptions);

    res.json(documents);
  } catch (err) {
    res.status(500).json({ message: "Error fetching documents", error: err });
  }
};
module.exports = {
  getAllDocument,
  createNewDocument,
  searchDocuments,
  filterDocuments,
};
