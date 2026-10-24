// middleware/auth.js
const jwt        = require("jsonwebtoken");
const { prepare } = require("../config/db");

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer "))
    return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user    = prepare("SELECT * FROM users WHERE id = ? AND is_active = 1").get(decoded.id);
    if (!user) return res.status(401).json({ message: "User not found" });
    delete user.password;
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

const adminProtect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer "))
    return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];
  try {
    let decoded;
    try   { decoded = jwt.verify(token, process.env.JWT_ADMIN_SECRET); }
    catch { decoded = jwt.verify(token, process.env.JWT_SECRET); }

    const user = prepare("SELECT * FROM users WHERE id = ? AND is_active = 1").get(decoded.id);
    if (!user) return res.status(401).json({ message: "User not found" });
    if (user.role !== "admin") return res.status(403).json({ message: "Admin access required" });
    delete user.password;
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = { protect, adminProtect };
