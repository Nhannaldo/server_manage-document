const Favorite = require("../models/Favorite");
const mongoose = require("mongoose");

async function getAllDocumentFavorite(req, res) {
  const { userId } = req.params;

  try {
    // Chuyển đổi userId từ chuỗi thành ObjectId
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Tìm tài liệu yêu thích theo userId
    const favorite = await Favorite.findOne({ userId: userObjectId }).populate(
      "favoriteDocuments.documentId"
    );

    // Kiểm tra nếu người dùng không có tài liệu yêu thích nào
    if (!favorite || favorite.favoriteDocuments.length === 0) {
      return res
        .status(404)
        .json({ message: "No favorite documents found for this user" });
    }

    // Trả về danh sách các tài liệu yêu thích
    res.status(200).json(favorite.favoriteDocuments);
  } catch (error) {
    console.error("Error fetching favorite documents:", error);
    res.status(500).json({ message: "Server error" });
  }
}

//Create New
async function createNewFavorite(req, res) {
  const { userId, documentId } = req.body;

  // Kiểm tra thông tin đầu vào
  if (!userId || !documentId) {
    return res
      .status(400)
      .json({ message: "userId and documentId are required" });
  }

  try {
    // Tìm bản ghi yêu thích của người dùng
    let favorite = await Favorite.findOne({ userId: userId });

    // Nếu không có bản ghi yêu thích, tạo mới
    if (!favorite) {
      favorite = new Favorite({
        userId: userId,
        favoriteDocuments: [{ documentId: documentId }],
      });
    } else {
      // Nếu đã có bản ghi yêu thích, thêm tài liệu vào mảng favoriteDocuments
      const documentExists = favorite.favoriteDocuments.some(
        (doc) => doc.documentId.toString() === documentId
      );

      if (!documentExists) {
        favorite.favoriteDocuments.push({ documentId: documentId });
      } else {
        return res
          .status(400)
          .json({ message: "Document is already favorited." });
      }
    }

    // Lưu bản ghi yêu thích
    await favorite.save();
    res.status(201).json(favorite);
  } catch (error) {
    console.error("Error creating favorite:", error);
    res.status(500).json({ message: "Server error" });
  }
}

//Delete
async function deleteFavoriteDocument(req, res) {
  const { userId } = req.body;
  const { documentId } = req.params;

  try {
    // Chuyển userId và documentId từ chuỗi thành ObjectId
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const documentObjectId = new mongoose.Types.ObjectId(documentId);

    // Tìm và cập nhật tài liệu yêu thích của người dùng
    const favorite = await Favorite.findOneAndUpdate(
      { userId: userObjectId },
      { $pull: { favoriteDocuments: { documentId: documentObjectId } } },
      { new: true } // Trả về tài liệu đã cập nhật sau khi xóa
    );

    // Nếu không tìm thấy người dùng hoặc tài liệu yêu thích
    if (!favorite) {
      return res
        .status(404)
        .json({ message: "No favorite documents found for this user" });
    }

    // Trả về danh sách tài liệu yêu thích sau khi xóa
    res.status(200).json({
      message: "Document removed from favorites",
      favoriteDocuments: favorite.favoriteDocuments,
    });
  } catch (error) {
    console.error("Error deleting favorite document:", error);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  createNewFavorite,
  getAllDocumentFavorite,
  deleteFavoriteDocument,
};
