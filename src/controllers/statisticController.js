const Document = require("../models/Document");
const Subject = require("../models/Subject");

async function getAllStatistic(req, res) {
  try {
    // Tổng số tài liệu
    const totalDocuments = await Document.countDocuments();

    // Tổng số tài liệu đã được phê duyệt
    const approvedDocuments = await Document.countDocuments({
      status: "approved",
    });
    // Tổng số tài liệu đã hủy
    const rejectedDocuments = await Document.countDocuments({
      status: "rejected",
    });
    // Tổng số lượt tải xuống
    const totalDownloads = await Document.aggregate([
      { $group: { _id: null, total: { $sum: "$downloads" } } },
    ]);
    const totalDownloadCount = totalDownloads[0]?.total || 0;

    // Tài liệu theo từng môn
    const documentsBySubject = await Document.aggregate([
      { $group: { _id: "$subjectId", count: { $sum: 1 } } },
      {
        $lookup: {
          from: "subjects", // Tên collection của Subject
          localField: "_id",
          foreignField: "_id",
          as: "subjectInfo",
        },
      },
      { $unwind: "$subjectInfo" },
      { $project: { subjectName: "$subjectInfo.name", count: 1 } },
    ]);

    // Tài liệu được tải xuống trong tháng
    const startOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    );
    const downloadsThisMonth = await Document.aggregate([
      { $match: { uploadedAt: { $gte: startOfMonth } } },
      { $group: { _id: null, total: { $sum: "$downloads" } } },
    ]);
    const downloadsThisMonthCount = downloadsThisMonth[0]?.total || 0;

    // Tài liệu upload trong tháng
    const uploadsThisMonth = await Document.countDocuments({
      uploadedAt: { $gte: startOfMonth },
    });

    // Kết quả
    res.status(200).json({
      totalDocuments,
      approvedDocuments,
      rejectedDocuments,
      totalDownloadCount,
      documentsBySubject,
      downloadsThisMonthCount,
      uploadsThisMonth,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = { getAllStatistic };
