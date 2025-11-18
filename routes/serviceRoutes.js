const express = require("express");
const router = express.Router();
const {
  bookService,
  getMyServiceBookings,
  getAllServices,
  updateServiceStatus
} = require("../controllers/serviceController");

const { protect, isAdmin } = require("../middleware/authMiddleware");

router.post("/", protect, bookService);
router.get("/my-services", protect, getMyServiceBookings);
router.get("/", protect, isAdmin, getAllServices);
router.put("/:id", protect, isAdmin, updateServiceStatus);

module.exports = router;
