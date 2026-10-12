const jwt = require("jsonwebtoken");

// Runs before job routes. Checks the token and finds out who the user is.
module.exports = function (req, res, next) {
  const header = req.headers.authorization || ""; // "Bearer <token>"
  const token = header.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Please login first" });
  }

  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = data.id; // job routes use this
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token, please login again" });
  }
};
