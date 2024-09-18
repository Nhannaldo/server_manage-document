const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");

router.get("/get-all-category", categoryController.getAllCategory);
router.post("/create-new-category", categoryController.createNewCategory);

module.exports = router;
