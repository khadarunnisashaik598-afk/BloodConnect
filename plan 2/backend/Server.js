require("dotenv").config();
require("dns").setServers(['8.8.8.8', '8.8.4.4']);
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const donorRoutes = require("./routes/donorRoutes");
const authRoutes = require("./routes/authRoutes");
const statsRoutes = require("./routes/statsRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log("MongoDB connected to Atlas"))
.catch(err => console.log(err));
// Routes
app.use("/api/donors", donorRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/stats", statsRoutes);


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));