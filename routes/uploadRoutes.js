const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const { protect, isAdmin } = require("../middleware/authMiddleware");

// Only admins should upload images
router.post("/image", protect, isAdmin, upload.array("images", 5), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "No files uploaded" });
  }

  const uploaded = req.files.map(file => ({
    public_id: file.filename,
    url: file.path
  }));

  res.json(uploaded); // send array of uploaded files
});


module.exports = router;
