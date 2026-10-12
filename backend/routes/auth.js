const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

function makeToken(user) {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

// "  Pragya@Gmail.com " and "pragya@gmail.com" must be the same account
function cleanEmail(email) {
  return String(email || "").trim().toLowerCase();
}

// POST /api/auth/signup
router.post("/signup", async (req, res) => {
  const email = cleanEmail(req.body.email);
  const { password } = req.body;
  if (!email || !password || password.length < 6) {
    return res.status(400).json({ message: "Email and a password of 6+ characters needed" });
  }

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: "Email already registered" });

  const hashed = await bcrypt.hash(password, 10); // never store plain passwords
  const user = await User.create({ email, password: hashed });
  res.json({ token: makeToken(user), email: user.email });
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const email = cleanEmail(req.body.email);
  const { password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Wrong email or password" });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(400).json({ message: "Wrong email or password" });

  res.json({ token: makeToken(user), email: user.email });
});

module.exports = router;
