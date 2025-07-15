const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

// Route to create a new post
router.post(
  "/createblog",
  upload.fields([{ name: "images", maxCount: 5 }]),
  [authMiddleware, adminMiddleware],
  postController.createPost
);

// Route to get all posts
router.get("/allblogs", postController.getAllPosts);

// Route to get a specific post by ID
router.get("/blog/:id", postController.getPostById);

router.post("/like/:postId", authMiddleware, postController.addLike);

// Route to update a specific post by ID
router.put(
  "/edit/:id",
  upload.fields([{ name: "images", maxCount: 5 }]),
  [authMiddleware, adminMiddleware],
  postController.updatePost
);

// Route to delete a specific post by ID
router.delete(
  "/delete/:id",
  [authMiddleware, adminMiddleware],
  postController.deletePost
);

module.exports = router;
