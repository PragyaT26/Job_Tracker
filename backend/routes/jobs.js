const express = require("express");
const Job = require("../models/Job");
const auth = require("../middleware/auth");

const router = express.Router();
router.use(auth); // every job route needs a logged-in user

// A link is OK if empty or starts with http:// or https://
// (blocks things like "javascript:..." that could run code when clicked)
function badLink(link) {
  return link && !/^https?:\/\//i.test(link);
}

// GET all my jobs (newest first)
router.get("/", async (req, res) => {
  const jobs = await Job.find({ user: req.userId }).sort({ appliedDate: -1 });
  res.json(jobs);
});

// POST add a job
router.post("/", async (req, res) => {
  const { company, role, status, appliedDate, link, notes } = req.body;
  if (!company || !role) {
    return res.status(400).json({ message: "Company and role are required" });
  }
  if (badLink(link)) {
    return res.status(400).json({ message: "Link must start with http:// or https://" });
  }
  const job = await Job.create({
    user: req.userId,
    company, role, status, appliedDate, link, notes,
  });
  res.json(job);
});

// PUT edit a job (only if it is mine)
router.put("/:id", async (req, res) => {
  const { company, role, status, appliedDate, link, notes } = req.body;
  if (badLink(link)) {
    return res.status(400).json({ message: "Link must start with http:// or https://" });
  }
  const job = await Job.findOneAndUpdate(
    { _id: req.params.id, user: req.userId },
    { company, role, status, appliedDate, link, notes },
    { new: true }
  );
  if (!job) return res.status(404).json({ message: "Job not found" });
  res.json(job);
});

// DELETE a job (only if it is mine)
router.delete("/:id", async (req, res) => {
  const job = await Job.findOneAndDelete({ _id: req.params.id, user: req.userId });
  if (!job) return res.status(404).json({ message: "Job not found" });
  res.json({ message: "Deleted" });
});

module.exports = router;
