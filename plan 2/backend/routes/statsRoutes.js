const express = require("express");
const router = express.Router();
const Donor = require("../models/Donor");
const BloodRequest = require("../models/BloodRequest");

// Admin Stats
router.get("/admin-stats", async (req, res) => {
  try {
    const totalDonors = await Donor.countDocuments();
    const membersTakingBlood = await BloodRequest.countDocuments();
    const availablePackets = await Donor.countDocuments({ available: true });

    res.json({ totalDonors, membersTakingBlood, availablePackets });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// User Stats
router.get("/user-stats", async (req, res) => {
  try {
    const readyDonors = await Donor.countDocuments({ available: true });
    res.json({ readyDonors });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// All Donors List
router.get("/all-donors", async (req, res) => {
  try {
    const donors = await Donor.find().sort({ name: 1 });
    res.json(donors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// All Blood Requests (Members Taking Blood)
router.get("/all-requests", async (req, res) => {
  try {
    const requests = await BloodRequest.find().sort({ date: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Available Blood Packets - grouped by blood group
router.get("/available-packets", async (req, res) => {
  try {
    const donors = await Donor.find({ available: true }).sort({ bloodGroup: 1 });
    // Group by blood group
    const grouped = {};
    donors.forEach((d) => {
      const bg = d.bloodGroup || "Unknown";
      if (!grouped[bg]) grouped[bg] = [];
      grouped[bg].push(d);
    });
    res.json({ donors, grouped });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create Blood Request (Member taking blood)
router.post("/request", async (req, res) => {
  try {
    const { requesterName, bloodGroup, phone, city } = req.body;
    
    // Create the request
    const request = new BloodRequest({ requesterName, bloodGroup, phone, city });
    await request.save();

    // Deduct a blood packet: Mark one matching available donor as unavailable
    const donorToUpdate = await Donor.findOne({ bloodGroup, available: true });
    if (donorToUpdate) {
      donorToUpdate.available = false;
      await donorToUpdate.save();
      console.log(`[Packet Deduction] Donor ${donorToUpdate.name} marked unavailable for group ${bloodGroup}`);
    }

    res.status(201).json(request);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;


