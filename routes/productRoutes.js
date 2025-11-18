const express = require("express");
const router = express.Router();
const {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  getSingleProduct
} = require("../controllers/productController");

const upload = require("../middleware/uploadMiddleware");
const { protect, isAdmin } = require("../middleware/authMiddleware");

// NOTE: we use upload.array for both create and update
// protect admin create/update/delete routes
router.post("/", protect, isAdmin, upload.array("images", 5), createProduct);
router.get("/", getProducts);
router.get("/:id", getSingleProduct);
router.put("/:id", protect, isAdmin, upload.array("images", 5), updateProduct);
router.delete("/:id", protect, isAdmin, deleteProduct);

module.exports = router;
