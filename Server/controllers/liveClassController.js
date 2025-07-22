const LiveClass = require("../models/LiveClasses");
const uploadToCloudinary = require("../utils/uploadToCloudinary");

/* const LOCATIONS = ["Bhillai", "Mumbai", "Bangalore", "Berhampur"];
 */ exports.getLocations = async (req, res) => {
  try {
    const locations = await LiveClass.distinct("location");
    res.status(200).json(locations);
    // console.log(locations);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

// Create a new live class
exports.createLiveClass = async (req, res) => {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Forbidden: only admins can create LiveClasses!" });
  }
  try {
    const {
      course,
      description,
      day,
      time,
      duration,
      seats,
      price,
      location,
      level,
    } = req.body;

    console.log(req.body);

    // Parse day array from JSON string
    let dayArray = [];
    try {
      dayArray = JSON.parse(day);
    } catch (parseError) {
      console.error("Error parsing day array:", parseError);
      return res.status(400).json({
        error: "Invalid day format. Day must be a valid JSON array.",
      });
    }

    if (
      !course ||
      !description ||
      !Array.isArray(dayArray) ||
      dayArray.length === 0 ||
      !time ||
      !duration ||
      !seats ||
      !price ||
      !location ||
      !level
    ) {
      return res.status(400).json({
        error: "All fields are required, and day must be a non-empty array!",
      });
    }

    // Handle image upload
    let imageUrl = "";
    if (req.files && req.files.image && req.files.image[0]) {
      try {
        imageUrl = await uploadToCloudinary(req.files.image[0]);
        console.log("Image uploaded successfully:", imageUrl);
      } catch (uploadError) {
        console.error("Error uploading image:", uploadError);
        return res.status(400).json({ error: "Failed to upload image" });
      }
    }

    const liveClass = new LiveClass({
      course,
      description,
      day: dayArray,
      time,
      duration,
      seats,
      price,
      location,
      level,
      image: imageUrl,
    });

    await liveClass.save();
    res.status(201).json({
      success: true,
      message: "Live class created successfully",
      liveClass,
    });
  } catch (err) {
    console.error("Error creating live class:", err);
    res.status(400).json({ error: err.message });
  }
};

// Get all live classes, with optional location, and search filter, plus pagination
exports.getAllLiveClasses = async (req, res) => {
  try {
    const { location, search } = req.query;
    const filter = {};
    if (location) filter.location = location;

    if (search) {
      filter.$or = [
        { course: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { level: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }
    const liveClasses = await LiveClass.find(filter)
      .populate("course")
      .sort({ createdAt: 1 });
    res.status(200).json({
      liveClasses,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single live class by ID
exports.getLiveClassById = async (req, res) => {
  try {
    const liveClass = await LiveClass.findById(req.params.id)
      .populate("course")
      .populate("location");

    if (!liveClass) {
      return res.status(404).json({ message: "LiveClass not found" });
    }
    res.status(200).json({ liveClass });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a live class
exports.updateLiveClass = async (req, res) => {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Forbidden: only admins can update liveClasses!" });
  }
  try {
    const {
      course,
      description,
      day,
      time,
      duration,
      seats,
      price,
      location,
      level,
    } = req.body;

    console.log(req.body);

    // Handle image upload for updates
    let imageUrl = "";
    if (req.files && req.files.image && req.files.image[0]) {
      try {
        imageUrl = await uploadToCloudinary(req.files.image[0]);
        console.log("Image uploaded successfully:", imageUrl);
      } catch (uploadError) {
        console.error("Error uploading image:", uploadError);
        return res.status(400).json({ error: "Failed to upload image" });
      }
    }

    // Prepare update data
    const updateData = {
      course,
      description,
      day,
      time,
      duration,
      seats,
      price,
      location,
      level,
    };

    // Only update image if a new one was uploaded
    if (imageUrl) {
      updateData.image = imageUrl;
    }

    const liveClass = await LiveClass.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!liveClass) return res.status(404).json({ error: "Not found" });

    res
      .status(200)
      .json({ success: true, message: "Updated successfully", liveClass });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: err.message });
  }
};

// Delete a live class
exports.deleteLiveClass = async (req, res) => {
  try {
    const liveClass = await LiveClass.findByIdAndDelete(req.params.id);
    if (!liveClass) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Live class deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all live classes randomly (no filter, random order)
exports.getAllLiveClassesRandom = async (req, res) => {
  try {
    const liveClasses = await LiveClass.aggregate([{ $sample: { size: 50 } }]); // Adjust size as needed
    res.status(200).json({ liveClasses });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Toggle availability of a live class
exports.toggleAvailability = async (req, res) => {
  try {
    const liveClass = await LiveClass.findById(req.params.id);
    if (!liveClass) return res.status(404).json({ error: "Not found" });
    liveClass.available = !liveClass.available;
    await liveClass.save();
    res.status(200).json({ success: true, available: liveClass.available });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
