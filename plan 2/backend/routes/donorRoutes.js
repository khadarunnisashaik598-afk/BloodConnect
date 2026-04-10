const express = require("express");
const router = express.Router();
const Donor = require("../models/Donor");

// Add new donor
router.post("/", async (req, res) => {
    try {
        const donor = new Donor(req.body);
        await donor.save();
        res.status(201).json(donor);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get all donors
router.get("/", async (req, res) => {
    try {
        const donors = await Donor.find();
        res.json(donors);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Search donors by blood group and city
router.get("/search", async (req, res) => {
  const { bloodGroup, city } = req.query;
  let query = {};
  if (bloodGroup) query.bloodGroup = bloodGroup;
  if (city) {
    query.$or = [
      { city: { $regex: city, $options: "i" } },
      { location: { $regex: city, $options: "i" } }
    ];
  }
  // Include donors who are either marked available: true or don't have the field yet (defaulting to available)
  query.available = { $ne: false };

  try {
    const donors = await Donor.find(query);
    res.json(donors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Emergency search
router.get("/emergency/:bloodGroup", async (req, res) => {
  try {
    const blood = req.params.bloodGroup;
    const donors = await Donor.find({ bloodGroup: blood, available: true });
    res.json(donors);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Fetch current user's donor profile
router.get("/my-profile/:userId", async (req, res) => {
  try {
    const donor = await Donor.findOne({ userId: req.params.userId });
    res.json(donor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create or Update donor profile
router.post("/upsert", async (req, res) => {
  const { userId, name, bloodGroup, city, phone, latitude, longitude } = req.body;
  try {
    let donor = await Donor.findOne({ userId });
    if (donor) {
      donor.name = name;
      donor.bloodGroup = bloodGroup;
      donor.city = city;
      donor.phone = phone;
      if (latitude) donor.latitude = latitude;
      if (longitude) donor.longitude = longitude;
      await donor.save();
    } else {
      donor = new Donor({ userId, name, bloodGroup, city, phone, latitude, longitude });
      await donor.save();
    }
    res.json(donor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;