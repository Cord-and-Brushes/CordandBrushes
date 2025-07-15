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

module.exports = router;
