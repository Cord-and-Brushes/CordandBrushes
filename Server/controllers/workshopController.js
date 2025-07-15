// controllers/workshopController.js
const Workshop = require("../models/Workshop");
const uploadToCloudinary = require("../utils/uploadToCloudinary");

exports.createWorkshop = async (req, res) => {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Forbidden: only admin can create Workshops!" });
  }

  try {
    const {
      title,
      description,
      startDate,
      endDate,
      time,
      mode,
      location,
      seats,
    } = req.body;

    console.log(req.body);

    if (
      !title ||
      !description ||
      !startDate ||
      !endDate ||
      !time ||
      !mode ||
      !seats
    ) {
      return res.status(400).json({
        error: "All fields are required !",
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

    const workshop = new Workshop({
      title,
      description,
      startDate,
      endDate,
      time,
      mode,
      location,
      seats,
      image: imageUrl,
    });

    await workshop.save();
    res.status(201).json({
      success: true,
      message: "Workshop created successfully.",
      workshop,
    });
  } catch (err) {
    console.error("error creating workshop", err);
    res.status(400).json({ error: err.message });
  }
};

exports.getAllWorkshops = async (req, res) => {
  const workshops = await Workshop.find();
  res.json(workshops);
};

exports.getWorkshop = async (req, res) => {
  const workshop = await Workshop.findById(req.params.id);
  if (!workshop) return res.status(404).json({ error: "Not found" });
  res.json(workshop);
};

exports.updateWorkshop = async (req, res) => {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Forbidden: only admins can update workshops!" });
  }
  try {
    const {
      title,
      description,
      startDate,
      endDate,
      time,
      mode,
      location,
      seats,
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
      title,
      description,
      startDate,
      endDate,
      time,
      mode,
      location,
      seats,
    };

    // Only update image if a new one was uploaded
    if (imageUrl) {
      updateData.image = imageUrl;
    }

    const workshop = await Workshop.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
      }
    );

    if (!workshop) return res.status(404).json({ error: "Not found" });

    res
      .status(200)
      .json({ success: true, message: "Updated successfully", workshop });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: err.message });
  }
};

exports.deleteWorkshop = async (req, res) => {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Forbidden: only admins can update workshops!" });
  }
  try {
    const workshop = await Workshop.findByIdAndDelete(req.params.id);
    if (!workshop) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(400).json({ err });
  }
};
