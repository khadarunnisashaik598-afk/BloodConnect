require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const dns = require("dns");

// Try to bypass system DNS using Google DNS for Atlas SRV records
dns.setServers(['8.8.8.8', '8.8.4.4']);

const cors = require("cors");
const donorRoutes = require("./routes/donorRoutes");
const authRoutes = require("./routes/authRoutes");
const statsRoutes = require("./routes/statsRoutes");

const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
console.log("Connecting to MongoDB...");
mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 5000, // Fail fast (5s) instead of 30s
})
.then(() => {
  console.log("✅ SUCCESS: MongoDB connected to Atlas");
})
.catch(err => {
  console.error("❌ DATABASE CONNECTION ERROR:");
  console.error(err.message);
  console.log("--- DEBUG INFO ---");
  console.log("URI provided:", process.env.MONGODB_URI ? "YES (Check credentials)" : "NO (Check .env file)");
  console.log("TIP: Verify your IP is whitelisted in MongoDB Atlas and the password is correct.");
});
// Routes
app.use("/api/donors", donorRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/stats", statsRoutes);

// Serve Static Files (Production)
app.use(express.static(path.join(__dirname, "../frontend/build")));

// Catch-all to serve index.html for React Router
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));