const Category = require("../models/categoryModel");

// CREATE
exports.createCategory = async (req, res) => {
  const { name } = req.body;

  const category = await Category.create({ name });

  res.json({
    success: true,
    category,
  });
};

// GET ALL
exports.getCategories = async (req, res) => {
  const categories = await Category.find();

  res.json({
    success: true,
    categories,
  });
};

// DELETE
exports.deleteCategory = async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: "Deleted",
  });
};