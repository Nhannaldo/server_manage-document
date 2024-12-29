const User = require("../models/User");

async function getAllUser(req, res) {
  try {
    const allUsers = await User.find();
    return res.status(200).json(allUsers);
  } catch (error) {
    console.error("Error fetching Users:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching Reports" });
  }
}

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

async function createUser(req, res) {
  try {
    const { username, address, dateOfBirth, phone } = req.body;
    const newUser = new User({
      username,
      address,
      dateOfBirth,
      phone,
      role: "admin",
    });

    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Error creating user", error });
  }
}

async function deleteUser(req, res) {
  try {
    const { userId } = req.params;
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Error deleting user", error });
  }
}

async function updateUser(req, res) {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating role:", error);
    res.status(500).json({ message: "Error updating role", error });
  }
}

async function getUserById(req, res) {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Error fetching user", error });
  }
}

module.exports = {
  updateProfile,
  getAllUser,
  createUser,
  deleteUser,
  updateUser,
  getUserById,
};
