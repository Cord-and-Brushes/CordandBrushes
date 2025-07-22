const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/addcategory",
  upload.fields([
    { name: "thumbnailImage", maxCount: 1 },
    { name: "bannerImage", maxCount: 1 },
  ]),
  authMiddleware,
  adminMiddleware,
  categoryController.createCategory
);

router.get("/allcategories", categoryController.getAllCategories);

router.get("/products/:name", categoryController.getProductsByCategoryName);

// New route to toggle category availability
router.put(
  "/toggle-availability/:id",
  authMiddleware,
  adminMiddleware,
  categoryController.toggleCategoryAvailability
);

// New route to update category images
router.put(
  "/edit/:id",
  upload.fields([
    { name: "thumbnailImage", maxCount: 1 },
    { name: "bannerImage", maxCount: 1 },
  ]),
  authMiddleware,
  adminMiddleware,
  categoryController.updateCategoryImages
);

// Route to delete a category by ID
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  categoryController.deleteCategory
);

// This should be LAST
router.get("/:id", categoryController.getCategoryById);

module.exports = router;
