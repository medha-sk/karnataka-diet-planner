import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { ChevronLeft, ChevronRight, Save, Droplets } from "lucide-react";
import { useLang } from "../context/LanguageContext";
import { MEAL_ICONS, MEAL_TIMES, localDate, parseDate } from "../utils/health";

const TYPES = ["breakfast", "lunch", "dinner", "snack"];

export default function Tracker() {
  const { t, lang, dishName } = useLang();
  const today = localDate();
  const [date, setDate] = useState(today);
  const [meals, setMeals] = useState({});
  const [options, setOptions] = useState({});
  const [water, setWater] = useState(0);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);

  const loadHistory = () => axios.get("/api/tracker").then(r => setHistory(r.data.slice(0, 7))).catch(() => {});
  useEffect(() => { loadHistory(); }, []);

  useEffect(() => {
    setLoading(true);
    Promise.all([axios.get(`/api/diet/plan?date=${date}`), axios.get(`/api/tracker/${date}`)])
      .then(([p, r]) => {
        setOptions(p.data.allMeals);
        const rec = r.data;
        if (rec) {
          setMeals(rec.meals); setWater(rec.waterIntake || 0); setNotes(rec.notes || "");
        } else {
          const m = {};
          TYPES.forEach(k => { m[k] = p.data.plan[k] ? { name: p.data.plan[k].name, calories: p.data.plan[k].calories, completed: false } : { name: null, calories: 0, completed: false }; });
          setMeals(m); setWater(0); setNotes("");
        }
      }).catch(console.error).finally(() => setLoading(false));
  }, [date]);

  const toggle = (k) => setMeals(p => ({ ...p, [k]: { ...p[k], completed: !p[k]?.completed } }));
  const swap = (k, name) => {
    const opt = (options[k] || []).find(o => o.name === name);
    if (opt) setMeals(p => ({ ...p, [k]: { name: opt.name, calories: opt.calories, completed: p[k]?.completed } }));
  };
  const shift = (n) => { const d = parseDate(date); d.setDate(d.getDate() + n); const s = localDate(d); if (s <= today) setDate(s); };

  const save = async () => {
    setSaving(true);
    try { await axios.post("/api/tracker", { date, meals, waterIntake: water, notes }); toast.success(t("trk.saved")); loadHistory(); }
    catch { toast.error(t("trk.err")); } finally { setSaving(false); }
  };

  const vals = Object.values(meals);
  const eaten = vals.reduce((s, m) => s + (m?.completed ? m.calories || 0 : 0), 0);
  const planned = vals.reduce((s, m) => s + (m?.calories || 0), 0);
  const done = vals.filter(m => m?.completed).length;
  const isToday = date === today;
  const label = isToday ? t("trk.today") : parseDate(date).toLocaleDateString(lang === "kn" ? "kn-IN" : "en-IN", { weekday: "long", month: "short", day: "numeric" });

  return (
    <div className="fade-in">
      <div className="page-header">
        <div><h1 className="page-title">{t("trk.title")}</h1><p className="page-subtitle">{t("trk.sub")}</p></div>
        <button className="btn btn-primary" onClick={save} disabled={saving || loading}><Save size={16} /> {saving ? t("trk.saving") : t("trk.save")}</button>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22, flexWrap: "wrap" }}>
        <button className="btn btn-secondary btn-sm" onClick={() => shift(-1)} aria-label="Previous day"><ChevronLeft size={16} /></button>
        <div className="serif" style={{ fontSize: 18, fontWeight: 700, minWidth: 170, textAlign: "center" }}>{label}</div>
        <button className="btn btn-secondary btn-sm" onClick={() => shift(1)} disabled={isToday} aria-label="Next day"><ChevronRight size={16} /></button>
        <input type="date" className="input" style={{ width: "auto" }} value={date} max={today} onChange={e => e.target.value && setDate(e.target.value)} />
      </div>

      {loading ? <div style={{ padding: 60 }}><div className="spinner" /></div> : (
        <>
          <div className="grid-4" style={{ marginBottom: 22 }}>
            <div className="stat-card"><div className="stat-label">{t("trk.eaten")}</div><div className="stat-value" style={{ color: "var(--green)", fontSize: 28 }}>{eaten}</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{t("trk.of")} {planned} kcal</div>
              <div className="progress-bar" style={{ marginTop: 10 }}><div className="progress-fill" style={{ width: `${planned ? (eaten / planned) * 100 : 0}%`, background: "var(--green)" }} /></div></div>
            <div className="stat-card"><div className="stat-label">{t("trk.completed")}</div><div className="stat-value" style={{ color: "var(--orange)", fontSize: 28 }}>{done}/4</div><div style={{ fontSize: 12, color: "var(--text-muted)" }}>{t("trk.mealsToday")}</div></div>
            <div className="stat-card"><div className="stat-label">{t("trk.water")} 💧</div><div className="stat-value" style={{ color: "#0ea5e9", fontSize: 28 }}>{water}/8</div><div style={{ fontSize: 12, color: "var(--text-muted)" }}>{t("trk.glasses")}</div>
              <div className="progress-bar" style={{ marginTop: 10 }}><div className="progress-fill" style={{ width: `${Math.min(100, (water / 8) * 100)}%`, background: "#0ea5e9" }} /></div></div>
            <div className="stat-card"><div className="stat-label">{t("trk.remaining")}</div><div className="stat-value" style={{ color: "var(--text-muted)", fontSize: 28 }}>{Math.max(0, planned - eaten)}</div><div style={{ fontSize: 12, color: "var(--text-muted)" }}>{t("trk.kcalLeft")}</div></div>
          </div>

          <div className="grid-2" style={{ alignItems: "start" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <h3 style={{ fontSize: 16 }}>{t("trk.mark")}</h3>
              {TYPES.map(k => {
                const m = meals[k] || {};
                const opts = options[k] || [];
                const hasCurrent = opts.some(o => o.name === m.name);
                return (
                  <div key={k} className={`meal-card ${m.completed ? "completed" : ""}`}>
                    <div style={{ display: "flex", alignItems: "center", gap: 14, cursor: "pointer" }} onClick={() => toggle(k)} role="checkbox" aria-checked={!!m.completed} tabIndex={0}
                      onKeyDown={e => (e.key === " " || e.key === "Enter") && (e.preventDefault(), toggle(k))}>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", flexShrink: 0, border: `2px solid ${m.completed ? "var(--green)" : "var(--border)"}`, background: m.completed ? "var(--green)" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 14, transition: "all .2s" }}>{m.completed && "✓"}</div>
                      <div style={{ fontSize: 24 }}>{MEAL_ICONS[k]}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{t(`meal.${k}`)} · {MEAL_TIMES[k]}</div>
                        <div style={{ fontSize: 14.5, fontWeight: 700, textDecoration: m.completed ? "line-through" : "none", color: m.completed ? "var(--text-muted)" : "var(--text)" }}>{m.name ? dishName(m.name) : t("trk.noMeal")}</div>
                      </div>
                      <div style={{ textAlign: "right" }}><div style={{ fontSize: 16, fontWeight: 700, color: m.completed ? "var(--green)" : "var(--text-muted)" }}>{m.calories || 0}</div><div style={{ fontSize: 11, color: "var(--text-muted)" }}>kcal</div></div>
                    </div>
                    {opts.length > 1 && (
                      <select className="input" style={{ marginTop: 10, padding: "7px 10px", fontSize: 13 }} aria-label={t("trk.swap")} value={hasCurrent ? m.name : ""} onChange={e => swap(k, e.target.value)}>
                        {!hasCurrent && <option value="">{t("trk.swap")}…</option>}
                        {opts.map(o => <option key={o.id} value={o.name}>{dishName(o.name)} — {o.calories} kcal</option>)}
                      </select>
                    )}
                  </div>
                );
              })}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div className="card">
                <h3 style={{ fontSize: 16, marginBottom: 4, display: "flex", alignItems: "center", gap: 8 }}><Droplets size={18} color="#0ea5e9" /> {t("trk.water")}</h3>
                <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 14 }}>{t("trk.waterHint")}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                  {Array.from({ length: 8 }, (_, i) => <button key={i} className={`water-btn ${i < water ? "filled" : ""}`} aria-label={`${i + 1}`} onClick={() => setWater(i + 1 === water ? i : i + 1)}>💧</button>)}
                </div>
                <div style={{ marginTop: 14, fontSize: 13, color: "#0369a1" }}>{water >= 8 ? t("trk.waterGoal") : `${8 - water} ${t("trk.waterMore")}`}</div>
              </div>
              <div className="card">
                <h3 style={{ fontSize: 16, marginBottom: 12 }}>{t("trk.notes")}</h3>
                <textarea className="input" rows={4} placeholder={t("trk.notesPh")} value={notes} onChange={e => setNotes(e.target.value)} style={{ resize: "vertical" }} />
              </div>
              <div style={{ padding: "16px 20px", background: "linear-gradient(135deg,#fef3e2,#fde8df)", borderRadius: 14, border: "1px solid #f4c5a0" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--orange)", marginBottom: 4 }}>{t("trk.tipTitle")}</div>
                <div style={{ fontSize: 13, color: "#92400e" }}>{t("trk.tip")}</div>
              </div>
            </div>
          </div>

          <div className="card" style={{ marginTop: 22 }}>
            <h3 style={{ fontSize: 16, marginBottom: 14 }}>{t("trk.history")}</h3>
            {history.length === 0 ? <p style={{ color: "var(--text-muted)", fontSize: 14 }}>{t("trk.noHistory")}</p> : (
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {history.map(h => (
                  <button key={h.date} className={`pill ${h.date === date ? "on" : ""}`} onClick={() => setDate(h.date)}>
                    {parseDate(h.date).toLocaleDateString(lang === "kn" ? "kn-IN" : "en-IN", { day: "numeric", month: "short" })} · {h.totalCalories} kcal · 💧{h.waterIntake}
                  </button>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
