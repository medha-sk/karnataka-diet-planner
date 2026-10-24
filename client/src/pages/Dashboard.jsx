import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Flame, Droplets, Trophy, Calendar, TrendingUp, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useLang } from "../context/LanguageContext";
import { bmiOf, bmiCategory, BMI_COLOR, calorieTarget, MEAL_ICONS, parseDate } from "../utils/health";

export default function Dashboard() {
  const { user } = useAuth();
  const { t, lang, dishName, dishDesc } = useLang();
  const [stats, setStats] = useState(null);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([axios.get("/api/dashboard/stats"), axios.get("/api/diet/plan")])
      .then(([s, p]) => { setStats(s.data); setPlan(p.data); })
      .catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: 60 }}><div className="spinner" /></div>;

  const h = new Date().getHours();
  const greeting = t(h < 12 ? "dash.morning" : h < 17 ? "dash.afternoon" : "dash.evening");
  const bmi = bmiOf(user?.weight, user?.height), cat = bmiCategory(bmi);
  const target = calorieTarget(user || {}) || 2000;
  const todayPlan = plan?.plan || {};
  const planTotal = Object.values(todayPlan).reduce((s, m) => s + m.calories, 0);
  const today = stats?.today;
  const eatenPct = Math.min(100, ((today?.calories || 0) / target) * 100);

  const cards = [
    { label: t("dash.streak"), value: stats?.streak || 0, sub: t("dash.streakSub"), color: "var(--orange)", icon: Trophy },
    { label: t("dash.avg"), value: stats?.avgCalories || 0, sub: t("dash.avgSub"), color: "var(--green)", icon: Flame },
    { label: t("dash.days"), value: stats?.totalDays || 0, sub: t("dash.daysSub"), color: "#7c3aed", icon: Calendar },
    { label: t("dash.bmi"), value: bmi || "—", sub: cat ? t(`bmi.${cat}`) : t("dash.bmiAdd"), color: cat ? BMI_COLOR[cat] : "#0ea5e9", icon: TrendingUp },
  ];

  return (
    <div className="fade-in">
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 30, marginBottom: 4 }}>{greeting} {user?.name?.split(" ")[0]}</h1>
        <p style={{ color: "var(--text-muted)" }}>{t("dash.sub")}</p>
      </div>

      <div className="grid-4" style={{ marginBottom: 24 }}>
        {cards.map(({ label, value, sub, color, icon: Icon }) => (
          <div key={label} className="stat-card">
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <span className="stat-label">{label}</span>
              <div style={{ width: 36, height: 36, background: `${color}18`, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon size={18} color={color} /></div>
            </div>
            <div className="stat-value" style={{ color }}>{value}</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* today progress */}
      <div className="card" style={{ marginBottom: 24, display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 240 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 14 }}>
            <b>{t("dash.todayDone")}</b><span style={{ color: "var(--text-muted)" }}>{today?.calories || 0} / {target} kcal · {t("dash.target")}</span>
          </div>
          <div className="progress-bar" style={{ height: 12 }}><div className="progress-fill" style={{ width: `${eatenPct}%`, background: "linear-gradient(90deg,var(--green-light),var(--green))" }} /></div>
          <div style={{ display: "flex", gap: 18, marginTop: 10, fontSize: 13, color: "var(--text-muted)" }}>
            <span>🍽️ {today?.mealsDone || 0}/4 {t("dash.mealsDone")}</span><span>💧 {today?.water || 0}/8 {t("dash.glasses")}</span>
          </div>
        </div>
        <Link to="/tracker" className="btn btn-primary">{t("dash.logNow")} <ArrowRight size={16} /></Link>
      </div>

      <div className="grid-2" style={{ alignItems: "start" }}>
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <h3 style={{ fontSize: 18 }}>{t("dash.todayPlan")}</h3>
            <Link to="/diet-plan" style={{ fontSize: 13, color: "var(--green)", fontWeight: 600, textDecoration: "none" }}>{t("dash.viewPlan")} →</Link>
          </div>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 18 }}>{user?.dietType === "non-vegetarian" ? "🍗" : "🥦"} {t(`diet.${user?.dietType}`)} · {t(`goal.${user?.goal}.s`)}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {Object.entries(todayPlan).map(([meal, d]) => (
              <div key={meal} style={{ display: "flex", alignItems: "center", gap: 14, padding: 13, background: "var(--bg)", borderRadius: 12, border: "1px solid var(--border)" }}>
                <div style={{ fontSize: 24 }}>{MEAL_ICONS[meal]}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{t(`meal.${meal}`)}</div>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{dishName(d.name)}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{dishDesc(d.name, d.description)}</div>
                </div>
                <div style={{ textAlign: "right" }}><div style={{ fontSize: 16, fontWeight: 700, color: "var(--green)" }}>{d.calories}</div><div style={{ fontSize: 11, color: "var(--text-muted)" }}>kcal</div></div>
              </div>
            ))}
            <div style={{ padding: "12px 14px", background: "var(--green-pale)", borderRadius: 10, display: "flex", justifyContent: "space-between", fontWeight: 700, color: "var(--green)", fontSize: 14 }}>
              <span>{t("dash.total")}</span><span>{planTotal} kcal</span></div>
          </div>
        </div>

        <div className="card">
          <h3 style={{ fontSize: 18, marginBottom: 6 }}>{t("dash.weekly")}</h3>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 18 }}>{t("dash.last7")} ({target} kcal)</p>
          {stats?.weeklyData?.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {stats.weeklyData.map((d, i) => {
                const pct = Math.min((d.calories / target) * 100, 100);
                return (
                  <div key={i}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 13 }}>
                      <span style={{ color: "var(--text-muted)" }}>{parseDate(d.date).toLocaleDateString(lang === "kn" ? "kn-IN" : "en-IN", { weekday: "short", day: "numeric", month: "short" })}</span>
                      <span style={{ fontWeight: 600 }}>{d.calories} kcal · 💧{d.water}</span>
                    </div>
                    <div className="progress-bar"><div className="progress-fill" style={{ width: `${pct}%`, background: pct > 80 ? "var(--green)" : pct > 50 ? "var(--orange-light)" : "var(--yellow)" }} /></div>
                  </div>
                );
              })}
            </div>
          ) : <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-muted)" }}><div style={{ fontSize: 40, marginBottom: 12 }}>📊</div>{t("dash.empty")}</div>}
          <div style={{ marginTop: 22, padding: 16, background: "#e0f2fe", borderRadius: 12, display: "flex", gap: 10, alignItems: "center" }}>
            <Droplets size={20} color="#0ea5e9" />
            <div><div style={{ fontSize: 13, fontWeight: 700, color: "#0369a1" }}>{t("dash.hydrate")}</div><div style={{ fontSize: 12, color: "#0284c7" }}>{t("dash.hydrateSub")}</div></div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 24, padding: "20px 24px", background: "linear-gradient(135deg,var(--green),var(--green-dark))", borderRadius: 16, color: "#fff" }}>
        <div style={{ fontSize: 13, opacity: .8, marginBottom: 4 }}>{t("dash.tipTitle")}</div>
        <div style={{ fontSize: 15 }}>{t("dash.tip")}</div>
      </div>
    </div>
  );
}
