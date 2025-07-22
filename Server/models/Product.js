const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  rating: { type: Number, required: true },
});

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  new_price: {
    type: String,
    required: true,
  },
  old_price: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  available: {
    type: Boolean,
    default: true,
  },
  sizes: {
    type: [String],
    default: [],
  },
  popular: { type: Boolean, default: false },
  ratings: [ratingSchema],
});

module.exports = mongoose.model("Product", ProductSchema);
