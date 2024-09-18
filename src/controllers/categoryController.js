const Category = require("../models/Category");

async function getAllCategory(req, res) {
  try {
    const allCategorys = await Category.find();
    return res.status(200).json(allCategorys);
  } catch (error) {
    console.error("Error fetching Categorys:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching Categorys" });
  }
}

async function createNewCategory(req, res) {
  try {
    const { name } = req.body;

    // Check if name is provided
    if (!name) {
      return res.status(400).json({ message: "Category name is required." });
    }

    // Create and save the new category
    const newCategory = new Category({ name });
    await newCategory.save();

    // Send success response
    res.status(201).json(newCategory);
  } catch (error) {
    // Handle errors
    res.status(500).json({ message: "Error creating category", error });
  }
}
module.exports = { getAllCategory, createNewCategory };
