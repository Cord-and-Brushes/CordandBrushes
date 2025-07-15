const Product = require("../models/Product");
const Category = require("../models/Category");
const cloudinary = require("../config/cloudinary");

async function uploadToCloudinary(file) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "auto" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    stream.end(file.buffer);
  });
}

exports.createProduct = async (req, res) => {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Forbidden: only admins can create products!" });
  }
  try {
    console.log("Starting product upload...");

    // Validate form data
    const {
      name,
      categoryId,
      new_price,
      old_price,
      description,
      sizes,
      available,
      popular,
    } = req.body;
    console.log(req.body);
    if (
      !name ||
      !categoryId ||
      !new_price ||
      !old_price ||
      !description ||
      !sizes
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    // Upload product images to Cloudinary
    const imageUrls = await Promise.all(
      req.files.images.map(async (file) => {
        console.log("Uploading product file:", file.originalname);
        return await uploadToCloudinary(file);
      })
    );

    console.log("Collected image URLs:", imageUrls);

    const sizesArray = sizes.split(",").map((size) => size.trim());

    // Create a new product with the collected image URLs and category's id
    const product = new Product({
      name: name,
      images: imageUrls,
      category: category._id, // Updated to match schema
      new_price: new_price,
      old_price: old_price,
      sizes: sizesArray,
      description: description,
      available: available,
      popular: popular,
    });

    // Save the product to MongoDB
    await product.save();
    console.log("Saving Product to MongoDB Successful...");

    res.json({
      success: true,
      name: name,
      product,
    });
  } catch (err) {
    console.error("Error in request handler:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({}).populate("category", "name");
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "category",
      "name"
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ product });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.updateProduct = async (req, res) => {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Forbidden: only admins can update products!" });
  }
  try {
    const {
      name,
      description,
      categoryId,
      new_price,
      old_price,
      sizes,
      available,
      popular,
    } = req.body;
    console.log(req.body);
    if (
      !name ||
      !categoryId ||
      !new_price ||
      !old_price ||
      !description ||
      !sizes
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const sizesArray = sizes ? sizes.split(",").map((size) => size.trim()) : [];

    // Find the product by ID
    const productId = req.params.id;
    console.log(`Fetching product with custom ID: ${productId}`);

    const product = await Product.findById(req.params.id);
    console.log("found froduct:", product);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found!" });
    }

    // Handle file uploads if any are provided
    let imageUrls = [];
    let categoryBannerUrl = product.category_banner;
    let categoryThumbnailUrl = product.category_thumbnail;

    if (req.files?.images && req.files.images.length > 0) {
      imageUrls = await Promise.all(req.files.images.map(uploadToCloudinary));
    }

    // Update the product document with new values
    const update = {
      name,
      description,
      category: category._id,
      new_price,
      old_price,
      sizes: sizesArray,
      available,
      popular,
      images: imageUrls.length > 0 ? imageUrls : product.images,
      // category_banner: categoryBannerUrl ? categoryBannerUrl : product.category_banner,
      // category_thumbnail: categoryThumbnailUrl ? categoryThumbnailUrl : product.category_thumbnail,
    };
    console.log(update);
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: productId },
      update,
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.deleteProduct = async (req, res) => {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Forbidden: only admins can delete products!" });
  }
  try {
    // Find the product by ID
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Delete images from Cloudinary
    console.log("Deleting images from Cloudinary...");
    const imageUrls = [
      ...(product.images || []),
      product.category_banner,
      product.category_thumbnail,
    ].filter((url) => url && typeof url === "string"); // Filter out null, undefined, and non-string values

    const deletionPromises = imageUrls.map(async (imageUrl) => {
      try {
        // Extract public Id from the URL
        const publicId = imageUrl.substring(
          imageUrl.lastIndexOf("/") + 1,
          imageUrl.lastIndexOf(".")
        );
        await cloudinary.uploader.destroy(publicId);
        console.log(`Image with publicId ${publicId} deleted from cloudinary.`);
      } catch (err) {
        console.error(
          `Error deleting image with publicId ${publicId}from Cloudinary:`,
          err
        );
        return null;
      }
    });

    // Wait for all images to be deleted from Cloudinary
    await Promise.all(deletionPromises);

    // Delete the product from the database
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error in deleteProduct:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

exports.getProductByCategoryId = async (req, res) => {
  try {
    const categoryName = req.params.name;

    // Find category by name (case-insensitive)
    const category = await Category.findOne({
      name: { $regex: new RegExp(`^${categoryName}$`, "i") },
    });

    if (!category) {
      return res.status(404).json({
        message: `Category "${categoryName}" not found`,
        error: "CATEGORY_NOT_FOUND",
      });
    }

    const products = await Product.find({
      category: category._id,
      available: true, // Only return available products
    });

    if (!products.length) {
      return res.status(200).json({
        category: {
          name: category.name,
          bannerImage: category.banner_image,
        },
        products: [],
        message: "No products found for this category",
      });
    }

    res.status(200).json({
      category: {
        name: category.name,
        bannerImage: category.banner_image,
      },
      products,
    });
  } catch (error) {
    console.error("Error in getProductByCategoryId:", error);
    res.status(500).json({
      message: "Server error while fetching category products",
      error: error.message,
    });
  }
};

// ... existing code ...
exports.toggleProductAvailability = async (req, res) => {
  try {
    // Find the product by ID
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Toggle the 'available' status
    product.available = !product.available;

    // Save the updated product
    await product.save();

    res
      .status(200)
      .json({ message: "Product availability toggled successfully", product });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getPopularProducts = async (req, res) => {
  try {
    const popularProducts = await Product.find({ popular: true });
    res.status(200).json({ popularProducts });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
