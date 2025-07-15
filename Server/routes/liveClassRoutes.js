const express = require("express");
const router = express.Router();
const liveClassController = require("../controllers/liveClassController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
// In your routes/liveClassRoutes.js
router.get("/locations", liveClassController.getLocations);

// Create a new live class
router.post(
  "/addclass",
  upload.fields([{ name: "image", maxCount: 2 }]),
  authMiddleware,
  adminMiddleware,
  liveClassController.createLiveClass
);

// Get all live classes
router.get("/getclasses", liveClassController.getAllLiveClasses);
router.get("/getclasses/random", liveClassController.getAllLiveClassesRandom);
// Get a single live class by ID
router.get("/:id", liveClassController.getLiveClassById);

// Update a live class
router.put(
  "/edit/:id",
  authMiddleware,
  adminMiddleware,
  liveClassController.updateLiveClass
);

// Delete a live class
router.delete(
  "/delete/:id",
  authMiddleware,
  adminMiddleware,
  liveClassController.deleteLiveClass
);

// Toggle availability of a live class
router.put(
  "/toggle-availability/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const liveClass = await liveClassController.toggleAvailability(req, res);
      // The controller will handle the response
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

module.exports = router;
