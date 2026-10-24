// routes/tracker.js
const express     = require("express");
const router      = express.Router();
const { prepare } = require("../config/db");
const { protect } = require("../middleware/auth");

function rowToRecord(row) {
  if (!row) return null;
  return {
    id: row.id, user_id: row.user_id, date: row.date,
    meals: {
      breakfast: { name: row.breakfast_name, calories: row.breakfast_cal, completed: !!row.breakfast_done },
      lunch:     { name: row.lunch_name,     calories: row.lunch_cal,     completed: !!row.lunch_done },
      dinner:    { name: row.dinner_name,    calories: row.dinner_cal,    completed: !!row.dinner_done },
      snack:     { name: row.snack_name,     calories: row.snack_cal,     completed: !!row.snack_done },
    },
    waterIntake:   row.water_intake,
    totalCalories: row.total_calories,
    notes:         row.notes,
    created_at:    row.created_at,
  };
}

// GET last 30 records
router.get("/", protect, (req, res) => {
  const rows = prepare("SELECT * FROM trackers WHERE user_id = ? ORDER BY date DESC LIMIT 30").all(req.user.id);
  res.json(rows.map(rowToRecord));
});

// GET by date
router.get("/:date", protect, (req, res) => {
  const row = prepare("SELECT * FROM trackers WHERE user_id = ? AND date = ?").get(req.user.id, req.params.date);
  res.json(rowToRecord(row));
});

// POST / upsert
router.post("/", protect, (req, res) => {
  try {
    const { date, meals = {}, waterIntake = 0, notes = "" } = req.body;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date || "")) return res.status(400).json({ message: "Valid date required" });
    const b = meals.breakfast || {}, l = meals.lunch || {}, d = meals.dinner || {}, s = meals.snack || {};
    const totalCalories =
      (b.completed ? b.calories || 0 : 0) + (l.completed ? l.calories || 0 : 0) +
      (d.completed ? d.calories || 0 : 0) + (s.completed ? s.calories || 0 : 0);

    // Check if exists
    const existing = prepare("SELECT id FROM trackers WHERE user_id = ? AND date = ?").get(req.user.id, date);

    if (existing) {
      prepare(`
        UPDATE trackers SET
          breakfast_name=?, breakfast_cal=?, breakfast_done=?,
          lunch_name=?, lunch_cal=?, lunch_done=?,
          dinner_name=?, dinner_cal=?, dinner_done=?,
          snack_name=?, snack_cal=?, snack_done=?,
          water_intake=?, total_calories=?, notes=?, updated_at=datetime('now')
        WHERE user_id=? AND date=?
      `).run(
        b.name||null, b.calories||0, b.completed?1:0,
        l.name||null, l.calories||0, l.completed?1:0,
        d.name||null, d.calories||0, d.completed?1:0,
        s.name||null, s.calories||0, s.completed?1:0,
        waterIntake, totalCalories, notes,
        req.user.id, date
      );
    } else {
      prepare(`
        INSERT INTO trackers
          (user_id, date,
           breakfast_name, breakfast_cal, breakfast_done,
           lunch_name, lunch_cal, lunch_done,
           dinner_name, dinner_cal, dinner_done,
           snack_name, snack_cal, snack_done,
           water_intake, total_calories, notes)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
      `).run(
        req.user.id, date,
        b.name||null, b.calories||0, b.completed?1:0,
        l.name||null, l.calories||0, l.completed?1:0,
        d.name||null, d.calories||0, d.completed?1:0,
        s.name||null, s.calories||0, s.completed?1:0,
        waterIntake, totalCalories, notes
      );
    }

    const row = prepare("SELECT * FROM trackers WHERE user_id = ? AND date = ?").get(req.user.id, date);
    res.json(rowToRecord(row));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
