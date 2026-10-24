// routes/public.js — no login required (landing page, food explorer, contact form)
const express = require("express");
const router  = express.Router();
const { prepare } = require("../config/db");

const split = (s) => (s ? String(s).split("|").filter(Boolean) : []);
const mealOut = (m) => ({
  id: m.id, dietType: m.diet_type, goal: m.goal, mealType: m.meal_type,
  name: m.name, nameKn: m.name_kn, description: m.description, descriptionKn: m.description_kn,
  calories: m.calories, tags: m.tags ? m.tags.split(",").filter(Boolean) : [],
});
const condOut = (c) => ({
  key: c.key, label: c.label, labelKn: c.label_kn, tip: c.tip, tipKn: c.tip_kn,
  avoid: split(c.avoid), prefer: split(c.prefer), warningFoods: split(c.warning_foods),
});

router.get("/info", (req, res) => {
  const meals      = prepare("SELECT COUNT(*) c FROM meals").get().c;
  const conditions = prepare("SELECT COUNT(*) c FROM conditions WHERE key != 'none'").get().c;
  const members    = prepare("SELECT COUNT(*) c FROM users WHERE role='user'").get().c;
  const logs       = prepare("SELECT COUNT(*) c FROM trackers").get().c;
  res.json({ meals, conditions, members, logs });
});

router.get("/conditions", (req, res) =>
  res.json(prepare("SELECT * FROM conditions").all().map(condOut)));

router.get("/meals", (req, res) => {
  const { diet, goal, type, q, condition } = req.query;
  let sql = "SELECT * FROM meals WHERE 1=1"; const p = [];
  if (diet && diet !== "all")  { sql += " AND diet_type=?";  p.push(diet); }
  if (goal && goal !== "all")  { sql += " AND goal=?";       p.push(goal); }
  if (type && type !== "all")  { sql += " AND meal_type=?";  p.push(type); }
  if (q) { sql += " AND (name LIKE ? OR name_kn LIKE ? OR description LIKE ?)"; p.push(`%${q}%`, `%${q}%`, `%${q}%`); }
  sql += " ORDER BY diet_type, goal, meal_type, calories";
  let rows = prepare(sql).all(...p);
  if (condition && condition !== "none") {
    const warn = new Set();
    condition.split(",").forEach((k) => {
      const c = prepare("SELECT warning_foods FROM conditions WHERE key=?").get(k);
      if (c) split(c.warning_foods).forEach((w) => warn.add(w));
    });
    rows = rows.filter((m) => !warn.has(m.name));
  }
  res.json(rows.map(mealOut));
});

// English name -> Kannada, used by the UI to translate saved tracker entries
router.get("/translations", (req, res) => {
  const map = {};
  prepare("SELECT name,name_kn,description_kn FROM meals").all()
    .forEach((m) => { map[m.name] = { name: m.name_kn, description: m.description_kn }; });
  res.json(map);
});

router.post("/contact", (req, res) => {
  const { name, email, subject, message } = req.body || {};
  if (!name?.trim() || !email?.trim() || !message?.trim())
    return res.status(400).json({ message: "Name, email and message are required" });
  if (!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ message: "Invalid email address" });
  prepare("INSERT INTO messages (name,email,subject,message) VALUES (?,?,?,?)")
    .run(name.trim(), email.trim().toLowerCase(), (subject || "").trim(), message.trim());
  res.status(201).json({ message: "Thanks! We received your message." });
});

module.exports = router;
