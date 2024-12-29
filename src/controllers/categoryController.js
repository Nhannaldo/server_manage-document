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

async function getCategoryById(req, res) {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    return res.status(200).json(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching the category" });
  }
}

async function updateCategory(req, res) {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    return res.status(200).json(updatedCategory);
  } catch (error) {
    console.error("Error updating category:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while updating the category" });
  }
}

async function deleteCategory(req, res) {
  try {
    const { id } = req.params;

    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    return res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while deleting the category" });
  }
}

module.exports = {
  getAllCategory,
  createNewCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
