const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

router.put("/update-profile/:userId", userController.updateProfile);

router.get("/get-all-user", userController.getAllUser);

router.post("/create-user", userController.createUser);

router.put("/update-user/:userId", userController.updateUser);

router.delete("/delete-user/:userId", userController.deleteUser);

router.get("/get-all-user/:userId", userController.getUserById);

module.exports = router;
