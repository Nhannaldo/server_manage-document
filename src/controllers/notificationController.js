const Notification = require("../models/Notification");
let clients = []; // Mảng để chứa các client đang chờ

// Hàm long polling
const longPollingNotifications = async (req, res) => {
  const { userId } = req.params; // Lấy userId từ tham số route

  // Thêm client vào danh sách
  clients.push(res);

  // Lưu ý: sau khi có thông báo mới cho userId này, ta sẽ gọi hàm `sendNotificationToClients`
  // và gửi thông báo mới đến tất cả các client đang chờ.
};

// Hàm gửi thông báo mới tới các client đang chờ
const sendNotificationToClients = (notification) => {
  // Chỉ gửi thông báo cho các client đang chờ
  clients.forEach((client) => {
    client.json(notification); // Trả về thông báo mới cho client
    // Xóa client khỏi danh sách sau khi gửi thông báo
    const index = clients.indexOf(client);
    if (index > -1) {
      clients.splice(index, 1);
    }
  });
};

// Ví dụ: gửi thông báo mới khi có thay đổi
const createNotification = async (req, res) => {
  try {
    const { message, userId } = req.body;
    const newNotification = new Notification({ message, userId });
    await newNotification.save();

    // Gửi thông báo mới đến tất cả các client đang chờ
    sendNotificationToClients(newNotification);

    res.status(201).json(newNotification); // Trả về thông báo vừa tạo
  } catch (error) {
    res.status(500).json({ error: "Failed to create notification" });
  }
};

// Hàm lấy danh sách thông báo của một user
const getNotifications = async (req, res) => {
  const { userId } = req.params; // Lấy userId từ tham số route
  try {
    const notifications = await Notification.find({ userId }).sort({
      createdAt: -1,
    });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
};

// Hàm cập nhật trạng thái "đọc" của thông báo
const markAsRead = async (req, res) => {
  const { id } = req.params;
  try {
    const notification = await Notification.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }
    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: "Failed to update notification" });
  }
};

module.exports = {
  createNotification,
  getNotifications,
  markAsRead,
  longPollingNotifications,
};
