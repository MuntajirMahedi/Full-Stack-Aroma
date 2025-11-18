const Service = require("../models/Service");

exports.bookService = async (req, res) => {
  try {
    const { deviceType, issueDescription, preferredDate, pickupAddress } = req.body;

    const service = new Service({
      user: req.user.userId,
      deviceType,
      issueDescription,
      preferredDate,
      pickupAddress
    });

    await service.save();
    res.status(201).json({ msg: "Service booked successfully", service });
  } catch (err) {
    res.status(500).json({ msg: "Failed to book service", error: err.message });
  }
};

exports.getMyServiceBookings = async (req, res) => {
  try {
    const services = await Service.find({ user: req.user.userId });
    res.json(services);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching your services", error: err.message });
  }
};

exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find().populate("user");
    res.json(services);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching all services", error: err.message });
  }
};

exports.updateServiceStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ msg: "Service not found" });

    service.status = status;
    await service.save();

    res.json({ msg: "Service status updated", service });
  } catch (err) {
    res.status(500).json({ msg: "Error updating status", error: err.message });
  }
};
