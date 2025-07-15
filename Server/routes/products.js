const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

//create new product
router.post(
  "/addproduct",
  upload.fields([{ name: "images", maxCount: 5 }]),
  authMiddleware,
  adminMiddleware,
  productController.createProduct
);

//get all products
router.get("/allproducts", productController.getAllProducts);

//get popular products
router.get("/popular", productController.getPopularProducts);

//get products by category
router.get("/category/:name", productController.getProductByCategoryId);

//get a product by id
router.get("/:id", productController.getProductById);

//update a product
router.put(
  "/update/:id",
  upload.fields([
    { name: "images", maxCount: 5 },
    { name: "categoryBanner", maxCount: 10 },
    { name: "categoryThumbnail", maxCount: 1 },
  ]),
  [authMiddleware, adminMiddleware],
  productController.updateProduct
);

// Toggle product availability
router.put(
  "/toggle-availability/:id",
  [authMiddleware, adminMiddleware],
  productController.toggleProductAvailability
);

//delete a product
router.delete(
  "/delete/:id",
  [authMiddleware, adminMiddleware],
  productController.deleteProduct
);

//get products by category
/* router.get("/category/:id", productController.getProductByCategoryId); */
/* router.get("/category/:name", productController.getProductByCategoryId);
 */
module.exports = router;
