// routes/auth.js
const express  = require("express");
const router   = express.Router();
const bcrypt   = require("bcryptjs");
const jwt      = require("jsonwebtoken");
const { prepare, computeBMI } = require("../config/db");
const { protect } = require("../middleware/auth");

const genToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// Row -> API shape (camelCase, conditions as array, never the password)
function shape(u) {
  if (!u) return null;
  return {
    id: u.id, name: u.name, email: u.email, role: u.role,
    age: u.age, weight: u.weight, height: u.height,
    gender: u.gender, region: u.region, activityLevel: u.activity_level,
    goal: u.goal, dietType: u.diet_type,
    medicalConditions: (u.medical_conditions || "none").split(",").filter(Boolean),
    bmi: u.bmi, bodyType: u.body_type, createdAt: u.created_at,
  };
}
const condString = (v) => {
  const arr = Array.isArray(v) ? v : String(v || "none").split(",");
  const clean = arr.map((s) => s.trim()).filter(Boolean);
  return clean.length ? clean.join(",") : "none";
};

router.post("/register", (req, res) => {
  try {
    const { name, email, password, age, weight, height, goal, dietType, gender, region, activityLevel, medicalConditions } = req.body;
    if (!name?.trim() || !email?.trim() || !password)
      return res.status(400).json({ message: "Name, email and password are required" });
    if (!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ message: "Please enter a valid email" });
    if (password.length < 6) return res.status(400).json({ message: "Password must be at least 6 characters" });
    if (prepare("SELECT id FROM users WHERE email = ?").get(email.toLowerCase()))
      return res.status(400).json({ message: "An account with this email already exists" });

    const hash = bcrypt.hashSync(password, 10);
    const { bmi, bodyType } = computeBMI(+weight, +height);
    const r = prepare(`
      INSERT INTO users (name,email,password,age,weight,height,goal,diet_type,gender,region,activity_level,medical_conditions,bmi,body_type)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`)
      .run(name.trim(), email.toLowerCase(), hash, age || null, weight || null, height || null,
           goal || "maintain", dietType || "vegetarian", gender || null, region || null,
           activityLevel || "moderate", condString(medicalConditions), bmi, bodyType);
    const user = prepare("SELECT * FROM users WHERE id = ?").get(r.lastInsertRowid);
    res.status(201).json({ ...shape(user), token: genToken(user.id) });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post("/login", (req, res) => {
  try {
    const { email, password } = req.body;
    const user = prepare("SELECT * FROM users WHERE email = ?").get(String(email || "").toLowerCase());
    if (!user || !bcrypt.compareSync(password || "", user.password))
      return res.status(401).json({ message: "Invalid email or password" });
    if (!user.is_active) return res.status(403).json({ message: "Account is disabled. Contact admin." });
    prepare("UPDATE users SET last_login = datetime('now') WHERE id = ?").run(user.id);
    res.json({ ...shape(user), token: genToken(user.id) });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get("/profile", protect, (req, res) => res.json(shape(req.user)));

router.put("/profile", protect, (req, res) => {
  try {
    const { name, age, weight, height, goal, dietType, gender, region, activityLevel, medicalConditions } = req.body;
    const w = weight || req.user.weight, h = height || req.user.height;
    const { bmi, bodyType } = computeBMI(+w, +h);
    prepare(`
      UPDATE users SET
        name=COALESCE(?,name), age=COALESCE(?,age), weight=COALESCE(?,weight), height=COALESCE(?,height),
        goal=COALESCE(?,goal), diet_type=COALESCE(?,diet_type), gender=COALESCE(?,gender),
        region=COALESCE(?,region), activity_level=COALESCE(?,activity_level),
        medical_conditions=COALESCE(?,medical_conditions),
        bmi=?, body_type=?, updated_at=datetime('now')
      WHERE id=?`)
      .run(name || null, age || null, weight || null, height || null, goal || null, dietType || null,
           gender || null, region || null, activityLevel || null,
           medicalConditions ? condString(medicalConditions) : null, bmi, bodyType, req.user.id);
    res.json(shape(prepare("SELECT * FROM users WHERE id = ?").get(req.user.id)));
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put("/password", protect, (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const u = prepare("SELECT * FROM users WHERE id=?").get(req.user.id);
  if (!bcrypt.compareSync(currentPassword || "", u.password))
    return res.status(400).json({ message: "Current password is wrong" });
  if (!newPassword || newPassword.length < 6)
    return res.status(400).json({ message: "New password must be at least 6 characters" });
  prepare("UPDATE users SET password=? WHERE id=?").run(bcrypt.hashSync(newPassword, 10), u.id);
  res.json({ message: "Password updated" });
});

module.exports = router;
