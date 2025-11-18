const User = require("../models/User");

// Get Logged-in User Profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching profile", error: err.message });
  }
};

// Update Logged-in User Profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.name = name || user.name;
    user.email = email || user.email;

    await user.save();
    res.status(200).json({ msg: "Profile updated", user });
  } catch (err) {
    res.status(500).json({ msg: "Error updating profile", error: err.message });
  }
};

// ✅ NEW: Get All Users (Admin Use)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching users", error: err.message });
  }
};
// ✅ Delete User (Admin Use)
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const deleted = await User.findByIdAndDelete(userId);
    if (!deleted) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.status(200).json({ msg: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Error deleting user", error: err.message });
  }
};