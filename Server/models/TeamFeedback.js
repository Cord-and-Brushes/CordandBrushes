const mongoose = require("mongoose");

const TeamFeedbackSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    img: {
      type: String, // URL or path to the image
      required: false,
    },
    role: {
      type: String,
      required: true,
    },
    feedback: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TeamFeedback", TeamFeedbackSchema);
