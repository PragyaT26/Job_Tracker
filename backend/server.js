require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB error:", err.message));

app.get("/", (req, res) => res.send("Job Tracker API is running"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/jobs", require("./routes/jobs"));

// Any error inside a route ends up here
app.use((err, req, res, next) => {
  console.log(err.message);
  res.status(500).json({ message: "Something went wrong" });
});

// Locally we start a server. On Vercel, the exported app is used instead.
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => console.log("Server running on port " + PORT));
}

module.exports = app;
