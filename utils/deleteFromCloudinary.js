const cloudinary = require("../config/cloudinary");

const deleteFromCloudinary = async (public_id) => {
  try {
    await cloudinary.uploader.destroy(public_id);
  } catch (err) {
    console.error("Error deleting from Cloudinary:", err.message);
  }
};

module.exports = deleteFromCloudinary;
