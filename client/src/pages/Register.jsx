import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useLang } from "../context/LanguageContext";
import AuthShell from "../components/AuthShell";
import useConditions from "../hooks/useConditions";
import { CONDITION_EMOJI, CONDITION_ORDER } from "../utils/health";

export const REGIONS = ["Bengaluru", "Mysuru", "Coastal Karnataka", "North Karnataka", "Malnad & Coorg", "Other"];

// shared helper for Register + Profile
export function toggleCondition(list, value) {
  if (value === "none") return ["none"];
  let u = list.filter(c => c !== "none");
  u = u.includes(value) ? u.filter(c => c !== value) : [...u, value];
  return u.length ? u : ["none"];
}

export function ConditionPicker({ value, onChange }) {
  const { t, condLabel } = useLang();
  const conds = useConditions();
  const byKey = Object.fromEntries(conds.map(c => [c.key, c]));
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {CONDITION_ORDER.map(k => (
        <button type="button" key={k} className={`pill ${value.includes(k) ? "on" : ""}`} aria-pressed={value.includes(k)} onClick={() => onChange(toggleCondition(value, k))}>
          {CONDITION_EMOJI[k]} {k === "none" ? t("cond.none") : byKey[k] ? condLabel(byKey[k]) : k}
        </button>
      ))}
    </div>
  );
}

export default function Register() {
  const { t } = useLang();
  const [form, setForm] = useState({
    name: "", email: "", password: "", age: "", weight: "", height: "", gender: "male", region: "Bengaluru",
    goal: "maintain", dietType: "vegetarian", activityLevel: "moderate", medicalConditions: ["none"],
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const { data } = await axios.post("/api/auth/register", form);
      login(data);
      toast.success(`${t("reg.welcome")}, ${data.name}! 🎉`);
      navigate("/dashboard");
    } catch (err) { toast.error(err.response?.data?.message || "Registration failed"); }
    finally { setLoading(false); }
  };

  return (
    <AuthShell wide panelTitle={t("reg.title2")} panelPoints={[t("f1.t"), t("f2.t"), t("f4.t"), t("f6.t")]}>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, color: "var(--green)", marginBottom: 6 }}>{t("reg.title2")}</h1>
        <p style={{ color: "var(--text-muted)", fontSize: 14 }}>{t("reg.sub2")}</p>
      </div>
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="grid-2">
            <div className="form-group"><label className="label" htmlFor="r-n">{t("reg.name")} *</label><input id="r-n" className="input" autoComplete="name" value={form.name} onChange={set("name")} required /></div>
            <div className="form-group"><label className="label" htmlFor="r-e">{t("reg.email")} *</label><input id="r-e" type="email" className="input" autoComplete="email" value={form.email} onChange={set("email")} required /></div>
          </div>
          <div className="form-group"><label className="label" htmlFor="r-p">{t("reg.password")} * <span style={{ fontWeight: 400 }}>({t("reg.pwHint")})</span></label>
            <input id="r-p" type="password" className="input" autoComplete="new-password" minLength={6} value={form.password} onChange={set("password")} required /></div>

          <div className="grid-3" style={{ gap: 12 }}>
            <div className="form-group"><label className="label">{t("reg.age")}</label><input type="number" className="input" min="10" max="100" value={form.age} onChange={set("age")} /></div>
            <div className="form-group"><label className="label">{t("reg.weight")}</label><input type="number" className="input" min="20" max="300" value={form.weight} onChange={set("weight")} /></div>
            <div className="form-group"><label className="label">{t("reg.height")}</label><input type="number" className="input" min="100" max="250" value={form.height} onChange={set("height")} /></div>
          </div>
          <div className="grid-2">
            <div className="form-group"><label className="label">{t("reg.gender")}</label>
              <div className="row">{["male", "female", "other"].map(g => <button type="button" key={g} className={`choice ${form.gender === g ? "on" : ""}`} onClick={() => setForm({ ...form, gender: g })}>{g === "other" ? t("reg.other") : t(`bmi.${g}`)}</button>)}</div></div>
            <div className="form-group"><label className="label" htmlFor="r-r">{t("reg.region")}</label>
              <select id="r-r" className="input" value={form.region} onChange={set("region")}>{REGIONS.map(r => <option key={r} value={r}>{t(`region.${r}`)}</option>)}</select></div>
          </div>

          <div className="form-group"><label className="label">{t("reg.diet")}</label>
            <div className="row">{["vegetarian", "non-vegetarian"].map(d => <button type="button" key={d} className={`choice ${form.dietType === d ? "on" : ""}`} onClick={() => setForm({ ...form, dietType: d })}>{d === "vegetarian" ? "🥦" : "🍗"} {t(`diet.${d}`)}</button>)}</div></div>
          <div className="form-group"><label className="label">{t("reg.goal")}</label>
            <div className="row">{["lose", "maintain", "gain"].map(g => <button type="button" key={g} className={`choice ${form.goal === g ? "on" : ""}`} onClick={() => setForm({ ...form, goal: g })}>{t(`goal.${g}`)}<small>{t(`goal.${g}.d`)}</small></button>)}</div></div>
          <div className="form-group"><label className="label" htmlFor="r-a">{t("reg.activity")}</label>
            <select id="r-a" className="input" value={form.activityLevel} onChange={set("activityLevel")}>{["sedentary", "light", "moderate", "active"].map(a => <option key={a} value={a}>{t(`act.${a}`)}</option>)}</select></div>

          <div className="form-group">
            <label className="label">{t("reg.conditions")}</label>
            <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 10 }}>{t("reg.conditionsHint")}</p>
            <ConditionPicker value={form.medicalConditions} onChange={v => setForm({ ...form, medicalConditions: v })} />
            {!form.medicalConditions.includes("none") && <div style={{ marginTop: 12, padding: "10px 14px", background: "#fef3e2", borderRadius: 10, fontSize: 13, color: "#92400e" }}>⚕️ {t("reg.warn")}</div>}
          </div>

          <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>{loading ? t("reg.busy") : `${t("reg.btn")} 🌿`}</button>
        </form>
      </div>
      <p style={{ textAlign: "center", marginTop: 20, fontSize: 14, color: "var(--text-muted)" }}>
        {t("reg.have")} <Link to="/login" style={{ color: "var(--green)", fontWeight: 700, textDecoration: "none" }}>{t("reg.signin")}</Link>
      </p>
    </AuthShell>
  );
}
