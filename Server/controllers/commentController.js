const Comment = require("../models/Comment");
const Post = require("../models/Post");

exports.createComment = async (req, res) => {
  try {
    const { content, postId } = req.body;
    const author = req.user._id;
    // Create a new comment (approved: false by default)
    const comment = new Comment({
      content,
      author,
      post: postId,
      approved: false,
    });
    await comment.save();
    await comment.populate("author", "name");
    await comment.populate("replies.author", "name");
    // Add the comment ID to the post's comments array
    const post = await Post.findById(postId);
    post.comments.push(comment._id);
    await post.save();

    res.status(201).json({ message: "Comment created successfully", comment });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find({})
      .populate("author", "name")
      .populate("post", "title");
    res.status(200).json({ comments });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getCommentById = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id)
      .populate("author", "name")
      .populate("post", "title");
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    res.status(200).json({ comment });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.updateComment = async (req, res) => {
  try {
    const { content } = req.body;
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found!" });
    }

    // Only allow comment author to edit (not admin)
    if (!req.user || comment.author.toString() !== req.user._id) {
      return res
        .status(403)
        .json({ message: "Forbidden! Only comment author can edit." });
    }

    const updatedComment = await Comment.findByIdAndUpdate(
      req.params.id,
      { content },
      { new: true }
    );

    // Populate the comment author and reply authors
    await updatedComment.populate("author", "name");
    await updatedComment.populate("replies.author", "name");

    res.status(200).json({
      message: "Comment updated successfully",
      comment: updatedComment,
    });
  } catch (error) {
    /* console.log(error); */
    res.status(500).json({ message: "Server error", error });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found!" });
    }

    // Allow if user is author or admin
    if (
      !req.user ||
      (comment.author.toString() !== req.user._id && req.user.role !== "admin")
    ) {
      //console.log("Permission denied for comment deletion");
      return res.status(403).json({
        message: "Forbidden! Only comment author or admin can delete.",
      });
    }

    // Remove the comment ID from the post's comments array
    const post = await Post.findById(comment.post);
    if (post) {
      post.comments.pull(comment._id);
      await post.save();
    }

    await Comment.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    //console.log("Error in deleteComment:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

exports.createReply = async (req, res) => {
  try {
    const { content, author, commentId } = req.body;

    // Find the parent comment
    const parentComment = await Comment.findById(commentId);
    if (!parentComment) {
      return res.status(404).json({ message: "Parent comment not found" });
    }

    // Add the reply to the parent comment's replies array
    parentComment.replies.push({
      content,
      author,
      datePosted: new Date(),
    });

    // Save the updated parent comment
    await parentComment.save();

    // Populate the reply author
    await parentComment.populate("replies.author", "name");

    res.status(201).json({
      message: "Reply created successfully",
      reply: parentComment.replies[parentComment.replies.length - 1],
    });
  } catch (error) {
    console.error("Error in createReply:", error);
    res.status(500).json({
      message: "Server error",
      error,
    });
  }
};

exports.editReply = async (req, res) => {
  try {
    const { content } = req.body;
    const { id: replyId } = req.params;
    const { commentId } = req.body; // Assuming commentId is passed in the request body

    // Find the comment by ID
    const comment = await Comment.findById(commentId);

    // Find the reply within the comment's replies array and update it
    const replyIndex = comment.replies.findIndex((reply) =>
      reply._id.equals(replyId)
    );
    if (replyIndex === -1) {
      return res.status(404).json({ message: "Reply not found!" });
    }

    comment.replies[replyIndex].content = content;
    await comment.save();

    // Populate the reply author
    await comment.populate("replies.author", "name");

    res.status(200).json({
      success: true,
      message: "Reply updated",
      reply: comment.replies[replyIndex],
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.deleteReply = async (req, res) => {
  try {
    const { id: replyId } = req.params;
    const { commentId } = req.body; // Assuming commentId is passed in the request body

    // Find the comment by ID
    const comment = await Comment.findById(commentId);

    // Find the reply within the comment's replies array and remove it
    const replyIndex = comment.replies.findIndex((reply) =>
      reply._id.equals(replyId)
    );
    if (replyIndex === -1) {
      return res.status(404).json({ message: "Reply not found!" });
    }

    comment.replies.splice(replyIndex, 1);
    await comment.save();

    res
      .status(200)
      .json({ success: true, message: "Reply deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Admin-only: Approve a comment
exports.approveComment = async (req, res) => {
  try {
    // Only admin can approve
    if (!req.user || req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Forbidden: Only admin can approve comments." });
    }
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    comment.approved = true;
    await comment.save();
    res.status(200).json({ message: "Comment approved successfully", comment });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get all unapproved comments (admin only)
exports.getUnapprovedComments = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        message: "Forbidden: Only admin can view unapproved comments.",
      });
    }
    const comments = await Comment.find({ approved: false })
      .populate("author", "name")
      .sort({ datePosted: -1 });
    res.status(200).json({ comments });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get all comments for a specific post (admin, includes unapproved)
exports.getCommentsByPostId = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res
        .status(403)
        .json({
          message: "Forbidden: Only admin can view all comments for a post.",
        });
    }
    const { postId } = req.params;
    const comments = await Comment.find({ post: postId })
      .populate("author", "name")
      .sort({ datePosted: -1 });
    res.status(200).json({ comments });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
