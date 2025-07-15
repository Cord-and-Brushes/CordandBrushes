// models/AboutPageContent.js
const mongoose = require("mongoose");
const LeaderSchema = new mongoose.Schema({
  name: String,
  designation: String,
  image: String,
  description: String,
});

const TeamMemberSchema = new mongoose.Schema({
  name: String,
  designation: String,
  image: String,
});
const AboutPageContentSchema = new mongoose.Schema({
  storyTitle: String,
  storyText: String,
  storyImage: String,
  leaders: [LeaderSchema],
  teams: [TeamMemberSchema],
});
module.exports = mongoose.model("AboutPageContent", AboutPageContentSchema);
