// utils/health.js — BMI and calorie helpers shared by the website and the app
export const ACTIVITY = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725 };

export function bmiOf(weight, height) {
  const w = +weight, h = +height / 100;
  if (!w || !h) return null;
  return +(w / (h * h)).toFixed(1);
}
export function bmiCategory(bmi) {
  if (bmi == null) return null;
  return bmi < 18.5 ? "under" : bmi < 25 ? "normal" : bmi < 30 ? "over" : "obese";
}
export const BMI_COLOR = { under: "#0ea5e9", normal: "#2d6a4f", over: "#e76f51", obese: "#dc2626" };

// Mifflin–St Jeor, adjusted for activity and goal. Returns null if data is missing.
export function calorieTarget({ age, gender, weight, height, activityLevel = "moderate", goal = "maintain" }) {
  const a = +age, w = +weight, h = +height;
  if (!a || !w || !h) return null;
  const base = 10 * w + 6.25 * h - 5 * a + (gender === "male" ? 5 : gender === "female" ? -161 : -78);
  let kcal = base * (ACTIVITY[activityLevel] || 1.55);
  kcal += goal === "lose" ? -500 : goal === "gain" ? 400 : 0;
  return Math.max(1200, Math.round(kcal / 10) * 10);
}
export function healthyWeightRange(height) {
  const h = +height / 100;
  if (!h) return null;
  return [Math.round(18.5 * h * h), Math.round(24.9 * h * h)];
}
// local date YYYY-MM-DD (not UTC)
export function localDate(d = new Date()) {
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}
export const parseDate = (s) => new Date(s + "T00:00:00");

export const CONDITION_EMOJI = {
  none: "✅", diabetes: "🩸", hypertension: "💓", cholesterol: "🫀", thyroid: "🦋",
  pcod: "🌸", anemia: "🔴", kidney: "🫘", lactose: "🥛", gluten: "🌾",
};
export const CONDITION_ORDER = ["none", "diabetes", "hypertension", "cholesterol", "thyroid", "pcod", "anemia", "kidney", "lactose", "gluten"];
export const MEAL_ICONS = { breakfast: "🌅", lunch: "☀️", dinner: "🌙", snack: "🍎" };
export const MEAL_TIMES = { breakfast: "7:00–9:00", lunch: "12:00–14:00", dinner: "19:00–21:00", snack: "16:00–17:00" };
