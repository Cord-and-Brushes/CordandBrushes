const Category = require("../models/Category");
const Product = require("../models/Product");
const cloudinary = require("../config/cloudinary");
const uploadToCloudinary = require("../utils/uploadToCloudinary");

exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Category name is required!" });
    }

    const thumbnailImageUrl = await uploadToCloudinary(
      req.files.thumbnailImage[0]
    );
    const bannerImageUrl = await uploadToCloudinary(req.files.bannerImage[0]);

    const category = new Category({
      name,
      thumbnail_image: thumbnailImageUrl,
      banner_image: bannerImageUrl,
    });

    await category.save();
    res.status(200).json({ success: true, category });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.status(200).json({ categories });
  } catch (error) {
    res.status(500).json({ message: "Server error!", error });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found!" });
    }

    res.status(200).json({ category });
  } catch (error) {
    res.status(500).json({ message: "Server error!", error });
  }
};

exports.getProductsByCategoryName = async (req, res) => {
  try {
    const category = await Category.findOne({ name: req.params.name });
    if (!category) {
      return res.status(404).json({ message: "Category not found!" });
    }

    const products = await Product.find({ category: category._id });
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.toggleCategoryAvailability = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found!" });
    }

    category.available = !category.available;

    await category.save();

    res
      .status(200)
      .json({ message: "Category availability toggled successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error!", error });
  }
};
