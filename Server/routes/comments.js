const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Public routes (no authentication required)
router.get("/allcomments", commentController.getAllComments);
router.get("/comment/:id", commentController.getCommentById);

// Protected routes (authentication required)
router.post("/createcomment", authMiddleware, commentController.createComment);
router.put("/edit/:id", authMiddleware, commentController.updateComment);
router.delete("/delete/:id", authMiddleware, commentController.deleteComment);
router.post("/createreply", authMiddleware, commentController.createReply);
router.put("/editreply/:id", authMiddleware, commentController.editReply);
router.delete(
  "/deletereply/:id",
  authMiddleware,
  commentController.deleteReply
);

// Approve a comment (admin only)
router.put(
  "/approve/:id",
  authMiddleware,
  adminMiddleware,
  commentController.approveComment
);

// Get all unapproved comments (admin only)
router.get(
  "/unapproved",
  authMiddleware,
  adminMiddleware,
  commentController.getUnapprovedComments
);

// Get all comments for a specific post (admin, includes unapproved)
router.get(
  "/bypost/:postId",
  authMiddleware,
  adminMiddleware,
  commentController.getCommentsByPostId
);

module.exports = router;
