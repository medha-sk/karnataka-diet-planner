import { useState } from "react";
import { Link } from "react-router-dom";
import { useLang } from "../context/LanguageContext";
import { bmiOf, bmiCategory, BMI_COLOR, calorieTarget, healthyWeightRange } from "../utils/health";

export default function BMICalculator() {
  const { t } = useLang();
  const [f, setF] = useState({ age: "", gender: "male", weight: "", height: "", activityLevel: "moderate", goal: "maintain" });
  const [res, setRes] = useState(null);
  const [err, setErr] = useState("");
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));

  const calc = (e) => {
    e.preventDefault();
    if (!+f.age || !+f.weight || !+f.height) { setErr(t("bmi.fill")); setRes(null); return; }
    setErr("");
    const bmi = bmiOf(f.weight, f.height);
    setRes({ bmi, cat: bmiCategory(bmi), kcal: calorieTarget(f), range: healthyWeightRange(f.height) });
  };
  const pos = res ? Math.min(98, Math.max(2, ((res.bmi - 12) / (40 - 12)) * 100)) : 0;

  return (
    <div className="bmi-box">
      <form onSubmit={calc}>
        <div className="grid-3" style={{ gap: 12 }}>
          <div className="form-group"><label className="label" htmlFor="b-age">{t("bmi.age")}</label>
            <input id="b-age" type="number" min="10" max="100" className="input" value={f.age} onChange={e => set("age", e.target.value)} placeholder="28" /></div>
          <div className="form-group"><label className="label" htmlFor="b-w">{t("bmi.weight")}</label>
            <input id="b-w" type="number" min="20" max="300" className="input" value={f.weight} onChange={e => set("weight", e.target.value)} placeholder="68" /></div>
          <div className="form-group"><label className="label" htmlFor="b-h">{t("bmi.height")}</label>
            <input id="b-h" type="number" min="100" max="250" className="input" value={f.height} onChange={e => set("height", e.target.value)} placeholder="170" /></div>
        </div>
        <div className="form-group"><label className="label">{t("bmi.gender")}</label>
          <div className="row">{["male", "female"].map(g => <button type="button" key={g} className={`choice ${f.gender === g ? "on" : ""}`} onClick={() => set("gender", g)}>{t(`bmi.${g}`)}</button>)}</div></div>
        <div className="form-group"><label className="label" htmlFor="b-act">{t("bmi.activity")}</label>
          <select id="b-act" className="input" value={f.activityLevel} onChange={e => set("activityLevel", e.target.value)}>
            {["sedentary", "light", "moderate", "active"].map(a => <option key={a} value={a}>{t(`act.${a}`)}</option>)}</select></div>
        <div className="form-group"><label className="label">{t("bmi.goal")}</label>
          <div className="row">{["lose", "maintain", "gain"].map(g => <button type="button" key={g} className={`choice ${f.goal === g ? "on" : ""}`} onClick={() => set("goal", g)}>{t(`goal.${g}`)}</button>)}</div></div>
        {err && <p role="alert" style={{ color: "#dc2626", fontSize: 13, marginBottom: 10 }}>{err}</p>}
        <button className="btn btn-primary btn-block btn-lg" type="submit">{t("bmi.calc")}</button>
      </form>

      <div className="bmi-result" aria-live="polite">
        {!res ? (
          <div><div style={{ fontSize: 54, marginBottom: 10 }}>⚖️</div><p style={{ opacity: .85 }}>{t("bmi.empty")}</p></div>
        ) : (
          <div className="fade-in">
            <div style={{ fontSize: 13, opacity: .8 }}>{t("bmi.yourBmi")}</div>
            <div className="serif" style={{ fontSize: 60, fontWeight: 700, lineHeight: 1.1 }}>{res.bmi}</div>
            <div style={{ display: "inline-block", background: "#fff", color: BMI_COLOR[res.cat], fontWeight: 700, borderRadius: 20, padding: "4px 16px", fontSize: 14, marginTop: 6 }}>{t(`bmi.${res.cat}`)}</div>
            <div className="bmi-gauge"><i style={{ left: `${pos}%` }} /></div>
            <div style={{ fontSize: 12, opacity: .75, marginBottom: 18 }}>{t("bmi.range")}: {res.range[0]}–{res.range[1]} kg</div>
            <div style={{ background: "rgba(255,255,255,.12)", borderRadius: 14, padding: 16, marginBottom: 18 }}>
              <div style={{ fontSize: 13, opacity: .8 }}>{t("bmi.target")}</div>
              <div className="serif" style={{ fontSize: 34, fontWeight: 700 }}>{res.kcal?.toLocaleString()} <span style={{ fontSize: 14, fontWeight: 500 }}>{t("bmi.kcalday")}</span></div>
            </div>
            <Link to="/register" className="btn btn-white btn-block">{t("bmi.cta")}</Link>
            <p style={{ fontSize: 11.5, opacity: .65, marginTop: 12 }}>{t("bmi.note")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
