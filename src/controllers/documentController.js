const Document = require("../models/Document");
const TypeFile = require("../models/TypeFile");
const Subject = require("../models/Subject");
const Notification = require("../models/Notification");
const mongoose = require("mongoose");

async function getAllDocument(req, res) {
  try {
    const allDocuments = await Document.find({ status: "approved" });
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
      uploadedBy,
      size,
    } = req.body;

    // Validate required fields
    if (
      !title ||
      !description ||
      !categoryId ||
      !subjectId ||
      !fileUrl ||
      !imageUrl ||
      !typefileId ||
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
      uploadedBy,
      size,
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
  const { q, category, typeFile, subject, pageCountRange, sort } = req.query; // Get the search term from query parameters

  if (!q) {
    return res.status(400).json({ message: "Title is required for search" });
  }

  try {
    let query = { title: { $regex: q, $options: "i" } };

    // Add filters if provided
    if (category) query.categoryId = category;
    if (typeFile) query.typefileId = typeFile;
    if (subject) query.subjectId = subject;

    // Add page count range filter
    if (pageCountRange) {
      const [min, max] = pageCountRange.split("-");
      query.pagenumber = {
        $gte: Number(min),
        ...(max && { $lte: Number(max) }),
      };
    }

    let sortCriteria = {};
    if (sort === "new") sortCriteria = { createdAt: -1 };
    if (sort === "downloaded") sortCriteria = { downloads: -1 };
    if (sort === "viewed") sortCriteria = { views: -1 };
    const documents = await Document.find(query).sort(sortCriteria);

    // Return the matching documents
    res.status(200).json(documents);
  } catch (error) {
    res.status(500).json({ message: "Error occurred while searching", error });
  }
};

//filter document
const filterDocuments = async (req, res) => {
  try {
    const { subjectNames, typefileId, pageCountRange, sortBy } = req.query;
    const categoryId = "66e79e86632f4719bd5d38e9";
    console.log("Query parameters:", req.query);

    // Build filter object
    let filter = {};

    // Add category to filter if provided
    if (categoryId) {
      filter.categoryId = categoryId; // Example: { category: "document" }
    }
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
//filter lesson
const filterDocumentLessons = async (req, res) => {
  try {
    const { subjectNames, typefileId, pageCountRange, sortBy } = req.query;

    const categoryId = "66e79e92632f4719bd5d38eb";
    console.log("Query parameters:", req.query);

    // Build filter object
    let filter = {};

    // Add category to filter if provided
    if (categoryId) {
      filter.categoryId = categoryId; // Example: { category: "document" }
    }

    // Find typefileId by name if provided
    if (typefileId) {
      const typefile = await TypeFile.findOne({ name: typefileId });
      if (typefile) filter.typefileId = typefile._id;
    }

    // Filter by subjectNames
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
      .populate("subjectId", "name") // Populate subjectId
      .sort(sortOptions);

    res.json(documents);
  } catch (err) {
    res.status(500).json({ message: "Error fetching documents", error: err });
  }
};
//filter topic
const filterDocumentTopics = async (req, res) => {
  try {
    const { subjectNames, typefileId, pageCountRange, sortBy } = req.query;

    const categoryId = "66e79eb1632f4719bd5d38ed";
    console.log("Query parameters:", req.query);

    // Build filter object
    let filter = {};

    // Add category to filter if provided
    if (categoryId) {
      filter.categoryId = categoryId; // Example: { category: "document" }
    }

    // Find typefileId by name if provided
    if (typefileId) {
      const typefile = await TypeFile.findOne({ name: typefileId });
      if (typefile) filter.typefileId = typefile._id;
    }

    // Filter by subjectNames
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
      .populate("subjectId", "name") // Populate subjectId
      .sort(sortOptions);

    res.json(documents);
  } catch (err) {
    res.status(500).json({ message: "Error fetching documents", error: err });
  }
};
// get detail document
const getDetailDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const documentDetail = await Document.findById(id);

    if (!documentDetail) {
      return res.status(404).json({ message: "Tài liệu không tồn tại" });
    }
    res.status(200).json(documentDetail);
  } catch (error) {
    // Xử lý lỗi nếu có
    console.error(error);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

//upload
const getAllDocumentUploadUser = async (req, res) => {
  const { userId } = req.params;
  const { status } = req.query;
  try {
    const query = { uploadedBy: userId };
    // Nếu status được truyền, thêm điều kiện lọc theo status
    if (status !== undefined) {
      query.status = status;
    }
    const uploaddocuments = await Document.find(query);
    if (!uploaddocuments || uploaddocuments.length === 0) {
      return res
        .status(404)
        .json({ message: "No documents found for this user" });
    }
    res.status(200).json(uploaddocuments);
  } catch (error) {
    console.error("Error fetching uploaded documents:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//admin
// create document admin
async function createNewDocumentAdmin(req, res) {
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
      uploadedBy,
      size,
    } = req.body;

    // Validate required fields
    if (
      !title ||
      !description ||
      !categoryId ||
      !subjectId ||
      !fileUrl ||
      !imageUrl ||
      !typefileId ||
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
      uploadedBy,
      status: "approved",
      size,
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

//update document admin
async function updateDocumentById(req, res) {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Validate required fields
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid document ID" });
    }

    // Update the document
    const updatedDocument = await Document.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedDocument) {
      return res.status(404).json({ message: "Document not found" });
    }

    res.status(200).json(updatedDocument);
  } catch (error) {
    console.error("Error updating document:", error);
    res.status(500).json({ message: "Error updating document", error });
  }
}
//Cancel document
async function CancelDocumentId(req, res) {
  const documentId = req.params.id;
  try {
    // Tìm tài liệu dựa trên ID và kiểm tra trạng thái hiện tại
    const document = await Document.findById(documentId);

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    if (document.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Document is not in a pending state" });
    }

    // Cập nhật trạng thái tài liệu thành "canceled"
    document.status = "canceled";
    await document.save();

    res.json({
      message: "Document canceled successfully",
      document: document,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

// Lấy tất cả tài liệu đã tải lên (status = true)
const getAllDocumentUploaded = async (req, res) => {
  try {
    const documents = await Document.find({ status: "approved" })
      .populate("subjectId")
      .populate("uploadedBy");
    res.status(200).json({
      success: true,
      data: documents,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy tài liệu đã tải lên.",
      error: error.message,
    });
  }
};

// Lấy tất cả tài liệu đã tải lên (status = true)
const getAllDocumentRejected = async (req, res) => {
  try {
    const documents = await Document.find({ status: "rejected" })
      .populate("subjectId")
      .populate("uploadedBy");
    res.status(200).json({
      success: true,
      data: documents,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy tài liệu đã tải lên.",
      error: error.message,
    });
  }
};

// Lấy tất cả tài liệu đang chờ phê duyệt (status = false)
const getAllDocumentPending = async (req, res) => {
  try {
    const documents = await Document.find({ status: "pending" })
      .populate("subjectId")
      .populate("uploadedBy");
    res.status(200).json({
      success: true,
      data: documents,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy tài liệu đang chờ phê duyệt.",
      error: error.message,
    });
  }
};

const ApproveDocumentId = async (req, res) => {
  const documentId = req.params.id;
  try {
    // Tìm tài liệu dựa trên ID và kiểm tra trạng thái hiện tại
    const document = await Document.findById(documentId);

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    if (document.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Document is not in a pending state" });
    }

    // Cập nhật trạng thái tài liệu thành "approved"
    document.status = "approved";
    await document.save();

    // Gửi thông báo cho người dùng
    await Notification.create({
      userId: document.uploadedBy, // ID của người dùng tải lên tài liệu
      message: `Tài liệu "${document.title}" đã được phê duyệt.`,
    });

    res.json({
      message: "Document approved successfully",
      document: document,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
const RejectDocumentId = async (req, res) => {
  const documentId = req.params.id;
  const { rejectionReason } = req.body; // Lấy lý do từ chối từ body

  try {
    // Tìm tài liệu dựa trên ID và kiểm tra trạng thái hiện tại
    const document = await Document.findById(documentId);

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    if (document.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Document is not in a pending state" });
    }

    if (!rejectionReason) {
      return res.status(400).json({
        message: "Rejection reason is required when rejecting a document",
      });
    }

    // Cập nhật trạng thái tài liệu và lý do từ chối
    document.status = "rejected";
    document.rejectionReason = rejectionReason;
    await document.save();

    // Gửi thông báo cho người dùng
    await Notification.create({
      userId: document.uploadedBy, // ID của người dùng tải lên tài liệu
      message: `Tài liệu "${document.title}" bị từ chối. Lý do: ${rejectionReason}`,
    });

    res.json({
      message: "Document rejected successfully",
      document: document,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

//
const getDocumentById = async (req, res) => {
  const { id } = req.params;

  try {
    // Kiểm tra xem `id` có phải là ObjectId hợp lệ hay không
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }

    // Tìm tài liệu theo `id`
    const document = await Document.findById(id).populate(
      "categoryId subjectId typefileId uploadedBy"
    );

    if (!document) {
      return res.status(404).json({ message: "Tài liệu không được tìm thấy" });
    }

    // Trả về tài liệu nếu tìm thấy
    res.status(200).json(document);
  } catch (error) {
    console.error("Lỗi khi lấy tài liệu:", error);
    res.status(500).json({ message: "Đã xảy ra lỗi máy chủ" });
  }
};

const IncreaseView = async (req, res) => {
  try {
    const { documentId } = req.body;

    if (!documentId) {
      return res.status(400).json({ message: "Document ID is required" });
    }

    // Tìm và tăng view
    const document = await Document.findByIdAndUpdate(
      documentId,
      { $inc: { views: 1 } }, // Tăng views thêm 1
      { new: true } // Trả về tài liệu đã cập nhật
    );

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    res.status(200).json({
      message: "View count updated successfully",
      document,
    });
  } catch (error) {
    console.error("Error updating view count:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getTopDocuments = async (req, res) => {
  try {
    const topViewedDocuments = await Document.find({ status: "approved" })
      .sort({ views: -1 })
      .limit(8);

    const topDownloadedDocuments = await Document.find({ status: "approved" })
      .sort({ downloads: -1 })
      .limit(8);

    const newestDocuments = await Document.find({ status: "approved" })
      .sort({ createdAt: -1 })
      .limit(8);

    res.status(200).json({
      topViewedDocuments,
      topDownloadedDocuments,
      newestDocuments,
    });
  } catch (error) {
    console.error("Error fetching top documents:", error);
    res.status(500).json({ message: "Error fetching top documents", error });
  }
};

const getDocumentsByCategoryDocument = async (req, res) => {
  try {
    const categoryId = "66e79e86632f4719bd5d38e9";
    const documents = await Document.find({ categoryId })
      .populate("subjectId")
      .populate("uploadedBy");
    res.status(200).json(documents);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching documents by category", error });
  }
};

const getDocumentsByCategoryLesson = async (req, res) => {
  try {
    const categoryId = "66e79e92632f4719bd5d38eb";
    const documents = await Document.find({ categoryId })
      .populate("subjectId")
      .populate("uploadedBy");
    res.status(200).json(documents);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching lessons by category", error });
  }
};

const getDocumentsByCategoryTopic = async (req, res) => {
  try {
    const categoryId = "66e79eb1632f4719bd5d38ed";
    const documents = await Document.find({ categoryId })
      .populate("subjectId")
      .populate("uploadedBy");
    res.status(200).json(documents);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching topics by category", error });
  }
};
module.exports = {
  getAllDocument,
  createNewDocument,
  searchDocuments,
  filterDocuments,
  getDetailDocument,
  getAllDocumentUploadUser,
  getAllDocumentUploaded,
  getAllDocumentPending,
  ApproveDocumentId,
  getDocumentById,
  RejectDocumentId,
  IncreaseView,
  getAllDocumentRejected,
  createNewDocumentAdmin,
  updateDocumentById,
  CancelDocumentId,
  getTopDocuments,
  getDocumentsByCategoryDocument,
  getDocumentsByCategoryLesson,
  getDocumentsByCategoryTopic,
  filterDocumentLessons,
  filterDocumentTopics,
};
