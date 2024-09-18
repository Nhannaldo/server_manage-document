const User = require("../models/User");

async function updateProfile(req, res) {
  try {
    const { userId } = req.params;
    const { username, address, dateOfBirth, phone } = req.body;
    // Tìm người dùng theo id và cập nhật thông tin
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        username,
        address,
        dateOfBirth,
        phone,
      },
      { new: true, runValidators: true }
    );

    // Kiểm tra nếu không tìm thấy người dùng
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Trả về thông tin người dùng đã cập nhật
    res.status(200).json(updatedUser);
  } catch (error) {
    // Bắt lỗi và trả về lỗi
    console.error(error);
    res.status(500).json({ message: "Error updating profile", error });
  }
}

module.exports = { updateProfile };
