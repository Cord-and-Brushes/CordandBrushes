const Banner = require("../models/BannerImages");
const cloudinary = require("../config/cloudinary");

// Assuming this function is defined in your cloudinary configuration file
async function uploadToCloudinary(file) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "auto" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    stream.end(file.buffer);
  });
}

exports.uploadBannerImages = async (req, res) => {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Forbidden: only admins can create products!" });
  }
  try {
    const { pageName } = req.body;
    if (!pageName) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const imageUrls = await Promise.all(
      req.files.images.map(async (file) => {
        console.log("Uploading BannerFile:", file.originalname);
        return await uploadToCloudinary(file);
      })
    );
    console.log("collected Banner Image URL's:", imageUrls);

    const banner = new Banner({
      pageName: pageName,
      urls: imageUrls,
    });

    await banner.save();
    console.log("Saved Banner Images!");

    res.json({
      success: true,
      banner: banner,
    });
  } catch (error) {
    res.status(500).send("Server error");
  }
};

exports.editBannerImage = async (req, res) => {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Forbidden: only admins can update products!" });
  }
  try {
    const { pageName } = req.body;

    const bannerId = req.params.id;
    console.log(`Fetching banner with id ${bannerId}`);

    const banner = await Banner.findById(req.params.id);
    console.log("found banner:", banner);

    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    let bannerUrls = [];

    if (req.files?.images && req.files.images.length > 0) {
      bannerUrls = await Promise.all(req.files.images.map(uploadToCloudinary));
    }

    const update = {
      pageName,
      urls: bannerUrls.length > 0 ? bannerUrls : banner.urls,
    };
    console.log(update);

    const updatedBanner = await Banner.findOneAndUpdate(
      { _id: bannerId },
      update,
      { new: true }
    );
    if (!updatedBanner) {
      return res.status(404).json({ message: "Product not found" });
    }
    res
      .status(200)
      .json({
        success: true,
        message: "Banner updated successfully",
        product: updatedBanner,
      });
  } catch (error) {
    res.status(500).send("Server error");
  }
};

exports.deleteBannerImage = async (req, res) => {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Forbidden: only admins can delete products!" });
  }
  try {
    const banner = await Banner.findById(req.params.id);
    console.log(banner);
    console.log(req.params.id);

    if (!banner) {
      return res.status(404).json({ message: "Banner not found!" });
    }

    console.log("Deleting banner images from Cloudinary...");

    const deletionPromises = [...banner.urls].map(async (url) => {
      const publicId = url.substring(
        url.lastIndexOf("/") + 1,
        url.lastIndexOf(".")
      );
      try {
        await cloudinary.uploader.destroy(publicId);
        console.log(`Image with publicId ${publicId} deleted from cloudinary.`);
      } catch (err) {
        console.error(
          `Error Deleting image with PublicId ${publicId} from Cloudinary:`,
          err
        );
        throw err;
      }
    });

    await Promise.all(deletionPromises);

    await Banner.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Banner Deleted Successfully!" });
  } catch (error) {
    res.status(500).send("Server error");
  }
};

exports.getAllBannerImages = async (req, res) => {
  try {
    const banners = await Banner.find({});
    res.json(banners);
  } catch (error) {
    res.status(500).send("Server error");
  }
};

// Add this function to your bannerImgController.js

exports.getBannerById = async (req, res) => {
  try {
    const bannerId = req.params.id;
    const banner = await Banner.findById(bannerId);
    if (!banner) {
      return res.status(404).json({ message: "Banner not found!" });
    }
    res.status(200).json({ success: true, banner });
  } catch (error) {
    res.status(500).send("Server error");
  }
};

