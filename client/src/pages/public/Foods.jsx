import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Search, RotateCcw } from "lucide-react";
import { useLang } from "../../context/LanguageContext";
import useConditions from "../../hooks/useConditions";
import { CONDITION_EMOJI, MEAL_ICONS } from "../../utils/health";

export default function Foods() {
  const { t, lang, condLabel } = useLang();
  const conditions = useConditions();
  const init = { q: "", diet: "all", goal: "all", type: "all", condition: "none" };
  const [f, setF] = useState(init);
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const set = (k) => (e) => setF(p => ({ ...p, [k]: e.target.value }));

  useEffect(() => {
    setLoading(true);
    const id = setTimeout(() => {
      const qs = new URLSearchParams(f).toString();
      axios.get(`/api/public/meals?${qs}`).then(r => setMeals(r.data)).catch(() => setMeals([])).finally(() => setLoading(false));
    }, 200);
    return () => clearTimeout(id);
  }, [f]);

  return (
    <>
      <section className="foods-hero">
        <div className="container">
          <h1 style={{ fontSize: 40, color: "var(--green-dark)", marginBottom: 8 }}>{t("foods.title")}</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 16 }}>{t("foods.sub")}</p>
          <div className="filters">
            <div className="f" style={{ flex: 2, minWidth: 220 }}>
              <label className="label" htmlFor="fq">{t("foods.search")}</label>
              <div className="input-icon"><Search size={16} /><input id="fq" className="input" value={f.q} onChange={set("q")} placeholder={t("foods.search")} /></div>
            </div>
            <div className="f"><label className="label">{t("try.diet")}</label>
              <select className="input" value={f.diet} onChange={set("diet")}><option value="all">{t("foods.all")}</option><option value="vegetarian">{t("diet.vegetarian")}</option><option value="non-vegetarian">{t("diet.non-vegetarian")}</option></select></div>
            <div className="f"><label className="label">{t("try.goal")}</label>
              <select className="input" value={f.goal} onChange={set("goal")}><option value="all">{t("foods.all")}</option>{["lose", "maintain", "gain"].map(g => <option key={g} value={g}>{t(`goal.${g}.s`)}</option>)}</select></div>
            <div className="f"><label className="label">{t("foods.type")}</label>
              <select className="input" value={f.type} onChange={set("type")}><option value="all">{t("foods.all")}</option>{["breakfast", "lunch", "dinner", "snack"].map(m => <option key={m} value={m}>{t(`meal.${m}`)}</option>)}</select></div>
            <div className="f"><label className="label">{t("foods.safeFor")}</label>
              <select className="input" value={f.condition} onChange={set("condition")}><option value="none">{t("foods.anyCondition")}</option>
                {conditions.filter(c => c.key !== "none").map(c => <option key={c.key} value={c.key}>{CONDITION_EMOJI[c.key]} {condLabel(c)}</option>)}</select></div>
            <button className="btn btn-secondary" onClick={() => setF(init)} title={t("foods.reset")}><RotateCcw size={15} /></button>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 36 }}>
        <div className="container">
          <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 18 }}>{t("foods.showing")} <b>{meals.length}</b> {t("foods.results")}</p>
          {loading ? <div className="spinner" style={{ margin: "60px auto" }} />
            : meals.length === 0 ? <div style={{ textAlign: "center", padding: 60, color: "var(--text-muted)" }}><div style={{ fontSize: 48 }}>🍽️</div>{t("foods.none")}</div>
            : <div className="food-grid">
              {meals.map(m => (
                <div className="food-card fade-in" key={m.id}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "flex-start" }}>
                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <span style={{ fontSize: 26 }}>{MEAL_ICONS[m.mealType]}</span>
                      <div><div style={{ fontWeight: 700, fontSize: 15.5, lineHeight: 1.35 }}>{lang === "kn" && m.nameKn ? m.nameKn : m.name}</div>
                        <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{t(`meal.${m.mealType}`)}</div></div>
                    </div>
                    <span className="badge badge-green" style={{ flexShrink: 0 }}>{m.calories} kcal</span>
                  </div>
                  <p style={{ fontSize: 13.5, color: "var(--text-muted)", flex: 1 }}>{lang === "kn" && m.descriptionKn ? m.descriptionKn : m.description}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    <span className={`badge ${m.dietType === "vegetarian" ? "badge-green" : "badge-orange"}`}>{m.dietType === "vegetarian" ? "🥦" : "🍗"} {t(`diet.${m.dietType}`)}</span>
                    <span className="badge badge-yellow">{t(`goal.${m.goal}.s`)}</span>
                    {m.tags.slice(0, 2).map(tag => <span key={tag} className="tag">{tag}</span>)}
                  </div>
                </div>
              ))}
            </div>}
          <div style={{ textAlign: "center", marginTop: 44 }}>
            <Link to="/register" className="btn btn-primary btn-lg">{t("hero.cta1")}</Link>
          </div>
        </div>
      </section>
    </>
  );
}
