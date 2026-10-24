import { useEffect, useState } from "react";
import axios from "axios";
import { RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useLang } from "../context/LanguageContext";
import { MEAL_ICONS, MEAL_TIMES, CONDITION_EMOJI, calorieTarget, localDate, parseDate } from "../utils/health";

export default function DietPlan() {
  const { user } = useAuth();
  const { t, lang, dishName, dishDesc, condLabel, condTip } = useLang();
  const [data, setData] = useState(null);
  const [week, setWeek] = useState([]);
  const [shuffle, setShuffle] = useState(0);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("today");

  useEffect(() => {
    setLoading(true);
    axios.get(`/api/diet/plan?shuffle=${shuffle}`).then(r => setData(r.data)).catch(console.error).finally(() => setLoading(false));
  }, [shuffle]);
  useEffect(() => { axios.get("/api/diet/week").then(r => setWeek(r.data.days)).catch(() => {}); }, []);

  const regen = () => { setShuffle(s => s + 1); toast.success(t("plan.regenToast")); };
  const fmt = (d) => parseDate(d).toLocaleDateString(lang === "kn" ? "kn-IN" : "en-IN", { weekday: "long", day: "numeric", month: "short" });

  if (loading && !data) return <div style={{ padding: 60 }}><div className="spinner" /></div>;
  const plan = data?.plan || {};
  const total = Object.values(plan).reduce((s, m) => s + m.calories, 0);
  const target = calorieTarget(user || {});

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">{t("plan.title")}</h1>
          <p className="page-subtitle">{user?.dietType === "non-vegetarian" ? "🍗" : "🥦"} {t(`diet.${user?.dietType}`)} · {t(`goal.${user?.goal}.s`)}{target ? ` · ${t("plan.target")}: ${target} kcal` : ""}</p>
        </div>
        {tab === "today" && <button className="btn btn-secondary" onClick={regen}><RefreshCw size={16} /> {t("plan.regen")}</button>}
      </div>

      {data?.medicalTips?.length > 0 && (
        <div className="card" style={{ marginBottom: 22, background: "#fffbeb", borderColor: "#fde68a" }}>
          <h3 style={{ fontSize: 16, marginBottom: 12 }}>⚕️ {t("plan.health")}</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {data.medicalTips.map(c => <div key={c.key} style={{ fontSize: 14, color: "#78350f" }}><b>{CONDITION_EMOJI[c.key]} {condLabel(c)}:</b> {condTip(c)}</div>)}
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: 8, marginBottom: 22, flexWrap: "wrap" }}>
        {[["today", "plan.tabToday"], ["week", "plan.tabWeek"], ["all", "plan.tabAll"]].map(([k, key]) => (
          <button key={k} className={`pill ${tab === k ? "on" : ""}`} onClick={() => setTab(k)}>{t(key)}</button>
        ))}
      </div>

      {tab === "today" && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))", gap: 14, marginBottom: 22 }}>
            <div className="card" style={{ textAlign: "center", background: "linear-gradient(135deg,var(--green),var(--green-light))", border: "none", padding: 18 }}>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,.85)" }}>{t("plan.totalCal")}</div>
              <div className="serif" style={{ fontSize: 34, fontWeight: 700, color: "#fff" }}>{total}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,.85)" }}>{t("plan.kcalToday")}</div>
            </div>
            {Object.entries(plan).map(([meal, d]) => (
              <div key={meal} className="card" style={{ textAlign: "center", padding: 18 }}>
                <div style={{ fontSize: 24 }}>{MEAL_ICONS[meal]}</div>
                <div style={{ fontSize: 11.5, color: "var(--text-muted)", marginBottom: 2 }}>{t(`meal.${meal}`)}</div>
                <div className="serif" style={{ fontSize: 22, fontWeight: 700, color: "var(--green)" }}>{d.calories}</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>kcal</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {Object.entries(plan).map(([meal, d]) => (
              <div key={meal} className="card" style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
                <div style={{ width: 58, height: 58, borderRadius: 16, fontSize: 28, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg2)", flexShrink: 0 }}>{MEAL_ICONS[meal]}</div>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 3 }}>{t(`meal.${meal}`)} · {MEAL_TIMES[meal]}</div>
                  <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{dishName(d.name)}</div>
                  <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 8 }}>{dishDesc(d.name, d.description)}</div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>{d.tags.slice(0, 3).map(tag => <span key={tag} className="tag">{tag}</span>)}</div>
                </div>
                <div style={{ textAlign: "right" }}><div className="serif" style={{ fontSize: 26, fontWeight: 700, color: "var(--green)" }}>{d.calories}</div><div style={{ fontSize: 12, color: "var(--text-muted)" }}>kcal</div></div>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === "week" && (
        <>
          <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 16 }}>{t("plan.weekSub")}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {week.map((day, i) => (
              <div key={day.date} className="card" style={{ padding: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, flexWrap: "wrap", gap: 6 }}>
                  <b className="serif" style={{ fontSize: 17 }}>{i === 0 ? t("plan.today") : i === 1 ? t("plan.tomorrow") : fmt(day.date)}{i < 2 && <span style={{ fontWeight: 400, color: "var(--text-muted)", fontSize: 13 }}> · {fmt(day.date)}</span>}</b>
                  <span className="badge badge-green">{day.totalCalories} kcal</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 10 }}>
                  {Object.entries(day.plan).map(([meal, d]) => (
                    <div key={meal} style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 10, padding: "10px 12px" }}>
                      <div style={{ fontSize: 11.5, color: "var(--text-muted)" }}>{MEAL_ICONS[meal]} {t(`meal.${meal}`)}</div>
                      <div style={{ fontSize: 13.5, fontWeight: 600, margin: "2px 0" }}>{dishName(d.name)}</div>
                      <div style={{ fontSize: 12, color: "var(--green)", fontWeight: 600 }}>{d.calories} kcal</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === "all" && data && (
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          {Object.entries(data.allMeals).map(([type, items]) => (
            <div key={type}>
              <h3 style={{ fontSize: 18, marginBottom: 14 }}>{MEAL_ICONS[type]} {t(`meal.${type}`)} · {items.length} {t("plan.options")}</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(270px,1fr))", gap: 14 }}>
                {items.map(item => (
                  <div key={item.id} className="card" style={{ padding: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 8 }}>
                      <div style={{ fontSize: 15, fontWeight: 700 }}>{dishName(item.name)}</div>
                      <span className="badge badge-green" style={{ flexShrink: 0, height: "fit-content" }}>{item.calories} kcal</span>
                    </div>
                    <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{dishDesc(item.name, item.description)}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
