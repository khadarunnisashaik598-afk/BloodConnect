const mongoose = require("mongoose");

const donorSchema = new mongoose.Schema({
  name: String,
  bloodGroup: String,
  city: String,
  phone: String,
  latitude: Number,
  longitude: Number,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  available: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model("Donor", donorSchema);