const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");

router.get("/get-all-category", categoryController.getAllCategory);
router.post("/create-new-category", categoryController.createNewCategory);

router.get("/get-category/:id", categoryController.getCategoryById);
router.put("/update-category/:id", categoryController.updateCategory);
router.delete("/delete-category/:id", categoryController.deleteCategory);
module.exports = router;
