const mongoose = require("mongoose");

const LiveClassSchema = new mongoose.Schema({
  course: { type: String, required: true },
  /*  instructor: { type: String, required: true }, */
  time: { type: String, required: true },

  day: { type: [String], required: true },
  duration: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String },
  description: { type: String },
  level: {
    type: String,
    enum: ["Beginner", "Intermediate", "Advanced"],
    required: true,
  },
  seats: { type: Number, required: true },
  location: {
    type: String,
    enum: ["Bhillai", "Mumbai", "Bangalore", "Berhampur", "berhampur"],
    required: true,
  },
  available: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("LiveClass", LiveClassSchema);
