const express = require("express");
const router = express.Router();
const aboutpageController = require("../controllers/aboutpageController");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const adminMiddleware = require("../middleware/adminMiddleware");
const authMiddleware = require("../middleware/authMiddleware");

// GET About Page Content (public)
router.get("/content", aboutpageController.getAboutPageContent);

// PUT Update About Page Content (admin only)
router.put(
  "/content/edit",
  authMiddleware,
  adminMiddleware,
  aboutpageController.updateAboutPageContent
);

// Add this route for image upload (admin only)
router.post(
  "/upload-image",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  aboutpageController.uploadImage
);

// Team Members (admin only)
router.post(
  "/team/addmember",
  authMiddleware,
  adminMiddleware,
  aboutpageController.addTeamMember
);
router.put(
  "/team/edit/:memberId",
  authMiddleware,
  adminMiddleware,
  aboutpageController.updateTeamMember
);
router.delete(
  "/team/delete/:memberId",
  authMiddleware,
  adminMiddleware,
  aboutpageController.deleteTeamMember
);

// Leaders (admin only)
router.post(
  "/leader/addleader",
  authMiddleware,
  adminMiddleware,
  aboutpageController.addLeader
);
router.put(
  "/leader/edit/:leaderId",
  authMiddleware,
  adminMiddleware,
  aboutpageController.updateLeader
);
router.delete(
  "/leader/delete/:leaderId",
  authMiddleware,
  adminMiddleware,
  aboutpageController.deleteLeader
);

module.exports = router;
