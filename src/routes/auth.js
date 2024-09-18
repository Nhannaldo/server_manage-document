const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/login", authController.login);
router.post("/register", authController.register);
router.post("/logout", authController.logout);
router.post("/refreshtoken", authController.refreshToken);

module.exports = router;
