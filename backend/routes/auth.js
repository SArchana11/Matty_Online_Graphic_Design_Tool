 

// server/routes/auth.js
const express = require("express");
const router = express.Router();
const admin = require("../firebase");
const User = require("../models/User");

// Middleware to verify Firebase ID token
async function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1]; // "Bearer <token>"
  if (!token) return res.status(401).json({ msg: "No token" });

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded; // Firebase user info
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ msg: "Invalid token" });
  }
}

// ✅ Sync user with MongoDB
router.post("/sync", verifyToken, async (req, res) => {
  try {
    const { uid, email, name } = req.user;

    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        firebaseId: uid,
        email,
        username: name || email.split("@")[0],
      });
      await user.save();
    }

    res.json({ user });
  } catch (err) {
    console.error("Error syncing user:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Example protected route
router.get("/profile", verifyToken, (req, res) => {
  res.json({ msg: "Protected data", user: req.user });
});

module.exports = router;
