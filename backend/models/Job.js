const mongoose = require("mongoose");

// One job application. "user" tells us who owns it.
const jobSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  company: { type: String, required: true },
  role: { type: String, required: true },
  status: {
    type: String,
    enum: ["Applied", "Interview", "Offer", "Rejected"],
    default: "Applied",
  },
  appliedDate: { type: Date, default: Date.now },
  link: String,
  notes: String,
});

module.exports = mongoose.model("Job", jobSchema);
