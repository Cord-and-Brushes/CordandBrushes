const AboutPageContent = require("../models/AboutPageContent");
const uploadToCloudinary = require("../utils/uploadToCloudinary");

// Get About Page Content
exports.getAboutPageContent = async (req, res) => {
  try {
    const about = await AboutPageContent.findOne();
    if (!about) {
      return res.status(404).json({ message: "About page content not found" });
    }
    res.json(about);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Update About Page Content (admin only)
exports.updateAboutPageContent = async (req, res) => {
  try {
    const update = req.body;
    let about = await AboutPageContent.findOne();
    if (!about) {
      about = new AboutPageContent(update);
      await about.save();
      return res.status(201).json(about);
    }
    Object.assign(about, update);
    await about.save();
    res.json(about);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Add a Team Member
exports.addTeamMember = async (req, res) => {
  try {
    const about = await AboutPageContent.findOne();
    if (!about)
      return res.status(404).json({ message: "About page content not found" });
    about.teams.push(req.body);
    await about.save();
    res.status(201).json(about.teams);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Update a Team Member
exports.updateTeamMember = async (req, res) => {
  try {
    const { memberId } = req.params;
    const about = await AboutPageContent.findOne();
    if (!about)
      return res.status(404).json({ message: "About page content not found" });
    const member = about.teams.id(memberId);
    if (!member)
      return res.status(404).json({ message: "Team member not found" });
    Object.assign(member, req.body);
    await about.save();

    res.json(about.teams.id(memberId));

    // res.json(about.teams);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete a Team Member
exports.deleteTeamMember = async (req, res) => {
  try {
    const { memberId } = req.params;
    const about = await AboutPageContent.findOne();
    if (!about)
      return res.status(404).json({ message: "About page content not found" });
    const member = about.teams.id(memberId);
    //  console.log("Trying to delete team member:", memberId);
    // console.log("Found member:", member);
    if (!member)
      return res.status(404).json({ message: "Team member not found" });
    // Remove using filter instead of .remove()
    about.teams = about.teams.filter((m) => m._id.toString() !== memberId);
    await about.save();
    res.json({ message: "Team member deleted" });
  } catch (error) {
    console.error("Delete team member error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Add a Leader
exports.addLeader = async (req, res) => {
  try {
    const about = await AboutPageContent.findOne();
    if (!about)
      return res.status(404).json({ message: "About page content not found" });
    about.leaders.push(req.body);
    await about.save();
    res.status(201).json(about.leaders);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Update a Leader
exports.updateLeader = async (req, res) => {
  try {
    const { leaderId } = req.params;
    const about = await AboutPageContent.findOne();
    if (!about)
      return res.status(404).json({ message: "About page content not found" });
    const leader = about.leaders.id(leaderId);
    if (!leader) return res.status(404).json({ message: "Leader not found" });
    Object.assign(leader, req.body);
    await about.save();
    // Option 1: Return the updated leader
    res.json(about.leaders.id(leaderId));
    // Option 2: Return the updated leaders array
    // res.json(about.leaders);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete a Leader
exports.deleteLeader = async (req, res) => {
  try {
    const { leaderId } = req.params;
    const about = await AboutPageContent.findOne();
    if (!about)
      return res.status(404).json({ message: "About page content not found" });
    const leader = about.leaders.id(leaderId);
    if (!leader) return res.status(404).json({ message: "Leader not found" });
    /*  leader.remove(); */
    about.leaders = about.leaders.filter((l) => l._id.toString() !== leaderId);
    await about.save();
    res.json({ message: "Leader deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Add this route for image upload
exports.uploadImage = async (req, res) => {
  try {
    const imageUrl = await uploadToCloudinary(req.file);
    res.json({ imageUrl });
  } catch (error) {
    res.status(500).json({ message: "Image upload failed", error });
  }
};
