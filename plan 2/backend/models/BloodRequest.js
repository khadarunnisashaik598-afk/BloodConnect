const mongoose = require("mongoose");

const bloodRequestSchema = new mongoose.Schema({
  requesterName: { type: String, required: true },
  bloodGroup: { type: String, required: true },
  phone: { type: String, required: true },
  city: { type: String, required: true },
  date: { type: Date, default: Date.now },
  status: { type: String, default: "fulfilled" } // For stats, we assume success or track active requests
});

module.exports = mongoose.model("BloodRequest", bloodRequestSchema);
