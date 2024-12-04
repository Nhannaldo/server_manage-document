const Download = require("../models/Download");
const mongoose = require("mongoose");
const Document = require("../models/Document");
async function getAllDocumentDownload(req, res) {
  const { userId } = req.params;

  try {
    // Chuyển đổi userId từ chuỗi thành ObjectId
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Tìm tài liệu download theo userId
    const download = await Download.findOne({ userId: userObjectId }).populate(
      "downloadDocuments.documentId"
    );

    // Kiểm tra nếu người dùng không có tài liệu download nào
    if (!download || download.downloadDocuments.length === 0) {
      return res
        .status(404)
        .json({ message: "No download documents found for this user" });
    }

    // Trả về danh sách các tài liệu download
    res.status(200).json(download.downloadDocuments);
  } catch (error) {
    console.error("Error fetching download documents:", error);
    res.status(500).json({ message: "Server error" });
  }
}

//Create New
async function createNewDownload(req, res) {
  const { userId, documentId } = req.body;

  // Kiểm tra thông tin đầu vào
  if (!userId || !documentId) {
    return res
      .status(400)
      .json({ message: "userId and documentId are required" });
  }

  try {
    // Tìm bản ghi download của người dùng
    let download = await Download.findOne({ userId: userId });

    // Nếu không có bản ghi download, tạo mới
    if (!download) {
      download = new Download({
        userId: userId,
        downloadDocuments: [
          { documentId: documentId, downloadedAt: new Date() },
        ],
      });
      // Tăng downloadCount của tài liệu
      await Document.findByIdAndUpdate(
        documentId,
        { $inc: { downloads: 1 } }, // Tăng downloadCount lên 1
        { new: true }
      );
    } else {
      // Kiểm tra xem tài liệu đã tồn tại trong danh sách hay chưa
      const documentIndex = download.downloadDocuments.findIndex(
        (doc) => doc.documentId.toString() === documentId
      );

      if (documentIndex > -1) {
        // Nếu tài liệu đã tồn tại, cập nhật thời gian tải xuống
        download.downloadDocuments[documentIndex].downloadedAt = new Date();
      } else {
        // Nếu tài liệu chưa tồn tại, thêm tài liệu mới
        download.downloadDocuments.push({
          documentId: documentId,
          downloadedAt: new Date(),
        });
        await Document.findByIdAndUpdate(
          documentId,
          { $inc: { downloads: 1 } }, // Tăng downloads lên 1
          { new: true }
        );
      }
    }

    // Lưu bản ghi download
    await download.save();
    res.status(201).json(download);
  } catch (error) {
    console.error("Error creating download:", error);
    res.status(500).json({ message: "Server error" });
  }
}

//Delete
async function deleteDownloadDocument(req, res) {
  const { userId } = req.body;
  const { documentId } = req.params;

  try {
    // Chuyển userId và documentId từ chuỗi thành ObjectId
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const documentObjectId = new mongoose.Types.ObjectId(documentId);

    // Tìm và cập nhật tài liệu download của người dùng
    const download = await Download.findOneAndUpdate(
      { userId: userObjectId },
      { $pull: { downloadDocuments: { documentId: documentObjectId } } },
      { new: true } // Trả về tài liệu đã cập nhật sau khi xóa
    );

    // Nếu không tìm thấy người dùng hoặc tài liệu download
    if (!download) {
      return res
        .status(404)
        .json({ message: "No download documents found for this user" });
    }

    // Trả về danh sách tài liệu download sau khi xóa
    res.status(200).json({
      message: "Document removed from downloads",
      downloadDocuments: download.downloadDocuments,
    });
  } catch (error) {
    console.error("Error deleting download document:", error);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  createNewDownload,
  getAllDocumentDownload,
  deleteDownloadDocument,
};
