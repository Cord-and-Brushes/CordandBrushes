const Post = require("../models/Post");
const Comment = require("../models/Comment");
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

exports.createPost = async (req, res) => {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Forbidden: Only admins can create categories." });
  }
  try {
    const { title, content, author, quote } = req.body;

    if (!title || !content || !author || !quote) {
      return res.status(400).json({ error: "All fields are required" });
    }
    if (!req.files || !req.files.images) {
      return res.status(400).json({ error: "At least one image is required" });
    }
    const imageUrls = await Promise.all(
      req.files.images.map(async (file) => {
        console.log("Uploading blog image:", file.originalname);
        return await uploadToCloudinary(file);
      })
    );

    console.log("Collected image urls:", imageUrls);

    // Create a new post
    const post = new Post({
      title: title,
      content: content,
      author: author,
      quote: quote,
      bannerImage: imageUrls,
    });
    await post.save();

    console.log("Post saved successfully!");

    res
      .status(201)
      .json({ success: true, message: "Post created successfully", post });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({});
    res.status(200).json({ posts });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.deletePost = async (req, res) => {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Forbidden: Only admins can create categories." });
  }
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    console.log("Deleting images from Cloudinary...");
    const deletionPromises = [...post.bannerImage].map(async (imageUrl) => {
      const publicId = imageUrl.substring(
        imageUrl.lastIndexOf("/") + 1,
        imageUrl.lastIndexOf(".")
      );

      try {
        await cloudinary.uploader.destroy(publicId);
        console.log(`Image with publicId ${publicId} deleted from cloudinary!`);
      } catch (error) {
        console.error(
          `Error deleting Image with publicId ${publicId} from cloudinary:`,
          error
        );
        throw error;
      }
    });

    await Promise.all(deletionPromises);

    // Delete all comments associated with the post
    await Comment.deleteMany({ post: post._id });

    await Post.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Post and associated comments deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate({
      path: "comments",
      match: { approved: true }, // Only approved comments
      populate: [
        { path: "author", select: "name" },
        { path: "replies.author", select: "name" },
      ],
    });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json({ post });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.addLike = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user._id; // Assuming req.user contains the logged-in user's information

  try {
    // Find the post by ID
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the user has already liked the post
    const isLiked = post.likes.some((likeId) => likeId.equals(userId));
    if (isLiked) {
      return res
        .status(400)
        .json({ message: "You have already liked this post." });
    }

    // Add the like to the post
    post.likes.push(userId);
    await post.save();

    res
      .status(200)
      .json({ success: true, message: "Post liked successfully", post });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.updatePost = async (req, res) => {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Forbidden: Only admins can edit posts." });
  }
  try {
    const { title, content, author, quote } = req.body;

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (!title || !content || !author || !quote) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const imageUrls = req.files.images
      ? await Promise.all(
          req.files.images.map(async (file) => {
            console.log("Uploading blog image:", file.originalname);
            return await uploadToCloudinary(file);
          })
        )
      : post.bannerImage;

    post.title = title;
    post.content = content;
    post.author = author;
    post.quote = quote;
    post.bannerImage = imageUrls;

    await post.save();

    console.log("Post updated successfully!");

    res
      .status(200)
      .json({ success: true, message: "Post updated successfully", post });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
