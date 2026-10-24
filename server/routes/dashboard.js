// routes/dashboard.js
const express     = require("express");
const router      = express.Router();
const { prepare, localDate } = require("../config/db");
const { protect } = require("../middleware/auth");

function calculateStreak(records) {
  const dates = new Set(records.filter((r) => r.total_calories > 0 || r.water_intake > 0).map((r) => r.date));
  let streak = 0;
  const d = new Date();
  // if nothing logged today yet, the streak can still be alive from yesterday
  if (!dates.has(localDate(d))) d.setDate(d.getDate() - 1);
  while (dates.has(localDate(d))) { streak++; d.setDate(d.getDate() - 1); }
  return streak;
}

router.get("/stats", protect, (req, res) => {
  try {
    const last7  = prepare("SELECT * FROM trackers WHERE user_id = ? ORDER BY date DESC LIMIT 7").all(req.user.id);
    const recent = prepare("SELECT date,total_calories,water_intake FROM trackers WHERE user_id = ? ORDER BY date DESC LIMIT 60").all(req.user.id);
    const totalDays = prepare("SELECT COUNT(*) c FROM trackers WHERE user_id = ?").get(req.user.id).c;
    const withCal = last7.filter((r) => r.total_calories > 0);
    const avgCalories = withCal.length ? Math.round(withCal.reduce((s, r) => s + r.total_calories, 0) / withCal.length) : 0;
    const today = prepare("SELECT * FROM trackers WHERE user_id = ? AND date = ?").get(req.user.id, localDate());
    res.json({
      totalDays, avgCalories, streak: calculateStreak(recent),
      weeklyData: [...last7].reverse().map((r) => ({ date: r.date, calories: r.total_calories, water: r.water_intake })),
      today: today ? {
        calories: today.total_calories, water: today.water_intake,
        mealsDone: ["breakfast", "lunch", "dinner", "snack"].filter((m) => today[`${m}_done`]).length,
      } : null,
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
