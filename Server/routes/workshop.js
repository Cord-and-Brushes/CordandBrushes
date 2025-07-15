// routes/workshop.js

const express = require("express");
const router = express.Router();
const workshopController = require("../controllers/workshopController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
router.post(
  "/addworkshop",
  upload.fields([{ name: "image", maxCount: 2 }]),
  authMiddleware,
  adminMiddleware,
  workshopController.createWorkshop
);
router.get("/getallworkshops", workshopController.getAllWorkshops);
router.get("/:id", workshopController.getWorkshop);
router.put(
  "/edit/:id",
  upload.fields([{ name: "image", maxCount: 2 }]),
  authMiddleware,
  adminMiddleware,
  workshopController.updateWorkshop
);
router.delete(
  "/delete/:id",
  authMiddleware,
  adminMiddleware,
  workshopController.deleteWorkshop
);
/* router.get("/locations", workshopController.getLocations); */

module.exports = router;
