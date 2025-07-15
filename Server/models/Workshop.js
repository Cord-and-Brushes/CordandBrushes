const mongoose = require("mongoose");

const WorkshopSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  time: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  seats: { type: Number, required: true },
  image: { type: String },
  mode: {
    type: String,
    enum: ["Online", "Offline"],
    required: true,
  },
  location: {
    type: String,
    validate: {
      validator: function (v) {
        if (this.mode === "Offline") {
          return typeof v === "string" && v.trim().length > 0;
        }
        return true;
      },
      message: "Location is required for Offline workshops.",
    },
  },
  available: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Workshop", WorkshopSchema);
