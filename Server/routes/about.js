const express = require("express");
const router = express.Router();
const aboutpageController = require("../controllers/aboutpageController");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

// GET About Page Content
router.get("/content", aboutpageController.getAboutPageContent);

// PUT Update About Page Content (admin only)
router.put("/content/edit", aboutpageController.updateAboutPageContent);

// Add this route for image upload
router.post(
  "/upload-image",
  upload.single("image"),
  aboutpageController.uploadImage
);

// Team Members
router.post("/team/addmember", aboutpageController.addTeamMember); // Add
router.put("/team/edit/:memberId", aboutpageController.updateTeamMember); // Update
router.delete("/team/delete/:memberId", aboutpageController.deleteTeamMember); // Delete

// Leaders
router.post("/leader/addleader", aboutpageController.addLeader); // Add
router.put("/leader/edit/:leaderId", aboutpageController.updateLeader); // Update
router.delete("/leader/delete/:leaderId", aboutpageController.deleteLeader); // Delete

module.exports = router;
