const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Signup
router.post("/register", async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const user = new User({ username, email, password, role });
    await user.save();
    res.status(201).json({ message: "User registered" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login — accepts email OR username (flexible)
router.post("/login", async (req, res) => {
  const { email, username, password } = req.body;
  const identifier = email || username; // accept whichever is sent
  try {
    // Try matching by email OR username
    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
      password: password
    });
    console.log(`[Login] identifier="${identifier}" found=${!!user} role=${user?.role}`);
    if (!user) return res.status(400).json({ error: "Invalid credentials" });
    res.json({ _id: user._id, username: user.username, email: user.email, role: user.role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
