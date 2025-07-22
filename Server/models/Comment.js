const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    trim: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  datePosted: {
    type: Date,
    default: Date.now,
  },
  approved: {
    type: Boolean,
    default: false,
  },
  replies: [
    {
      content: {
        type: String,
        required: true,
        trim: true,
      },
      author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      datePosted: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

module.exports = mongoose.model("Comment", commentSchema);
