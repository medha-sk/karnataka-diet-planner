// routes/diet.js — personalised plans, driven by the `meals` + `conditions` tables
const express = require("express");
const router  = express.Router();
const { prepare, localDate } = require("../config/db");
const { protect } = require("../middleware/auth");

const TYPES = ["breakfast", "lunch", "dinner", "snack"];
const split = (s) => (s ? String(s).split("|").filter(Boolean) : []);
const mealOut = (m) => ({
  id: m.id, mealType: m.meal_type, name: m.name, nameKn: m.name_kn,
  description: m.description, descriptionKn: m.description_kn,
  calories: m.calories, tags: m.tags ? m.tags.split(",").filter(Boolean) : [],
});
const condOut = (c) => ({
  key: c.key, label: c.label, labelKn: c.label_kn, tip: c.tip, tipKn: c.tip_kn,
  avoid: split(c.avoid), prefer: split(c.prefer), warningFoods: split(c.warning_foods),
});

// small deterministic hash so the same user+date+shuffle always gives the same plan
function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

function buildCatalogue(user) {
  const diet = user.diet_type || "vegetarian", goal = user.goal || "maintain";
  const conditions = (user.medical_conditions || "none").split(",").filter((c) => c && c !== "none");
  const condRows = conditions.map((k) => prepare("SELECT * FROM conditions WHERE key=?").get(k)).filter(Boolean);
  const warn = new Set(condRows.flatMap((c) => split(c.warning_foods)));
  const rows = prepare("SELECT * FROM meals WHERE diet_type=? AND goal=? ORDER BY calories").all(diet, goal);
  const all = {}, full = {};
  TYPES.forEach((t) => {
    full[t] = rows.filter((m) => m.meal_type === t);
    const safe = full[t].filter((m) => !warn.has(m.name));
    all[t] = safe.length ? safe : full[t];   // never leave a slot empty
  });
  return { all, diet, goal, condRows, conditions };
}

function pickDay(cat, userId, date, shuffle = 0) {
  const plan = {};
  TYPES.forEach((t) => {
    const list = cat.all[t];
    if (list.length) plan[t] = mealOut(list[hash(`${userId}|${date}|${shuffle}|${t}`) % list.length]);
  });
  return plan;
}

router.get("/plan", protect, (req, res) => {
  try {
    const date = /^\d{4}-\d{2}-\d{2}$/.test(req.query.date || "") ? req.query.date : localDate();
    const shuffle = parseInt(req.query.shuffle) || 0;
    const cat = buildCatalogue(req.user);
    if (!cat.all.breakfast.length) return res.status(404).json({ message: "Plan not found" });
    const allMeals = {};
    TYPES.forEach((t) => (allMeals[t] = cat.all[t].map(mealOut)));
    res.json({
      date, plan: pickDay(cat, req.user.id, date, shuffle), allMeals,
      dietType: cat.diet, goal: cat.goal, conditions: cat.conditions.join(",") || "none",
      medicalTips: cat.condRows.map(condOut),
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// 7-day plan starting today
router.get("/week", protect, (req, res) => {
  try {
    const cat = buildCatalogue(req.user);
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(); d.setDate(d.getDate() + i);
      const date = localDate(d);
      const plan = pickDay(cat, req.user.id, date, 0);
      days.push({ date, plan, totalCalories: Object.values(plan).reduce((s, m) => s + m.calories, 0) });
    }
    res.json({ days });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get("/guidelines", protect, (req, res) =>
  res.json(prepare("SELECT * FROM conditions").all().map(condOut)));

module.exports = router;
