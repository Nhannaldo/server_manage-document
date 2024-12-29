const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");

router.get(
  "/get-all-notification/:userId",
  notificationController.getNotifications
);
router.post(
  "/create-new-notification",
  notificationController.createNotification
);
// router.delete(
//   "/delete-notification/:notificationId",
//   notificationController.deleteNotification
// );
router.get(
  "/long-polling/:userId",
  notificationController.longPollingNotifications
);
module.exports = router;
