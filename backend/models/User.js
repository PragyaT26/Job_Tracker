const mongoose = require("mongoose");

// A user has an email and a hashed password
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
});

module.exports = mongoose.model("User", userSchema);
