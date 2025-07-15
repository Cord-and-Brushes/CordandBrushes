const express = require('express');
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const bannerController = require('../controllers/bannerImgController');


// Upload banner images
router.post("/uploadbanner", upload.fields([
    {name:'images', maxCount: 5}
]), authMiddleware, adminMiddleware, bannerController.uploadBannerImages);

// Edit banner images
router.put("/edit/:id", upload.fields([
    {name:'images', maxCount: 5}
]), authMiddleware, adminMiddleware, bannerController.editBannerImage);

// Delete banner images
router.delete("/delete/:id",  authMiddleware, adminMiddleware, bannerController.deleteBannerImage);

router.get("/banner/:id", authMiddleware, adminMiddleware, bannerController.getBannerById);

router.get("/allbanners", bannerController.getAllBannerImages);

module.exports = router;