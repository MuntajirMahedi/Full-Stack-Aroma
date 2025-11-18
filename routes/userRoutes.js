const express = require("express");
const router = express.Router();
const { getProfile, updateProfile ,getAllUsers,deleteUser} = require("../controllers/userController");
const { protect, isAdmin } = require("../middleware/authMiddleware");

router.get("/me", protect, getProfile);
router.put("/me", protect, updateProfile);
router.get('/all', protect, isAdmin, getAllUsers);
router.delete("/:id", protect, isAdmin, deleteUser);


module.exports = router;
