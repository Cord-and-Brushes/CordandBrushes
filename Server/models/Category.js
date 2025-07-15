const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  available: {
    type: Boolean,
    default: true,
  },
  thumbnail_image: {
    type: String,
    required: true,
  },
  banner_image: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model("Category", CategorySchema);
