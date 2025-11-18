const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    deviceType: {
      type: String,
      enum: ["Laptop", "Desktop", "AC"],
      required: true
    },
    issueDescription: {
      type: String,
      required: true
    },
    preferredDate: {
      type: Date,
      required: true
    },
    pickupAddress: {
      address: String,
      city: String,
      pincode: String,
      state: String,
      country: String
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed", "Cancelled"],
      default: "Pending"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Service", serviceSchema);
