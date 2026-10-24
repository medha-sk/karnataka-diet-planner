import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Save, KeyRound } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useLang } from "../context/LanguageContext";
import { ConditionPicker, REGIONS } from "./Register";
import useConditions from "../hooks/useConditions";
import { bmiOf, bmiCategory, BMI_COLOR, calorieTarget, CONDITION_EMOJI } from "../utils/health";

export default function Profile() {
  const { user, login } = useAuth();
  const { t, condLabel, condTip } = useLang();
  const conds = useConditions();
  const [form, setForm] = useState({
    name: user?.name || "", age: user?.age || "", weight: user?.weight || "", height: user?.height || "",
    gender: user?.gender || "male", region: user?.region || "Bengaluru", activityLevel: user?.activityLevel || "moderate",
    goal: user?.goal || "maintain", dietType: user?.dietType || "vegetarian", medicalConditions: user?.medicalConditions?.length ? user.medicalConditions : ["none"],
  });
  const [saving, setSaving] = useState(false);
  const [pw, setPw] = useState({ currentPassword: "", newPassword: "" });
  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const save = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      const { data } = await axios.put("/api/auth/profile", form);
      login({ ...data, token: user.token }); toast.success(t("prof.saved"));
    } catch (err) { toast.error(err.response?.data?.message || "Error"); } finally { setSaving(false); }
  };
  const changePw = async (e) => {
    e.preventDefault();
    try { await axios.put("/api/auth/password", pw); toast.success(t("prof.pwDone")); setPw({ currentPassword: "", newPassword: "" }); }
    catch (err) { toast.error(err.response?.data?.message || "Error"); }
  };

  const bmi = bmiOf(form.weight, form.height), cat = bmiCategory(bmi), color = cat && BMI_COLOR[cat];
  const target = calorieTarget(form);
  const active = form.medicalConditions.filter(c => c !== "none");
  const byKey = Object.fromEntries(conds.map(c => [c.key, c]));
  const tip = active.includes("diabetes") ? t("prof.tipDiabetes") : active.includes("anemia") ? t("prof.tipAnemia") : active.includes("hypertension") ? t("prof.tipBp") : t("prof.tipDefault");

  return (
    <div className="fade-in">
      <div className="page-header"><div><h1 className="page-title">{t("prof.title")}</h1><p className="page-subtitle">{t("prof.sub")}</p></div></div>
      <div className="grid-2" style={{ alignItems: "start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <form className="card" onSubmit={save}>
            <h3 style={{ fontSize: 18, marginBottom: 18 }}>{t("prof.personal")}</h3>
            <div className="grid-2">
              <div className="form-group"><label className="label">{t("reg.name")}</label><input className="input" value={form.name} onChange={set("name")} required /></div>
              <div className="form-group"><label className="label">{t("prof.email")}</label><input className="input" value={user?.email || ""} disabled /></div>
            </div>
            <div className="grid-3" style={{ gap: 12 }}>
              <div className="form-group"><label className="label">{t("reg.age")}</label><input type="number" className="input" value={form.age} onChange={set("age")} /></div>
              <div className="form-group"><label className="label">{t("reg.weight")}</label><input type="number" className="input" value={form.weight} onChange={set("weight")} /></div>
              <div className="form-group"><label className="label">{t("reg.height")}</label><input type="number" className="input" value={form.height} onChange={set("height")} /></div>
            </div>
            <div className="grid-2">
              <div className="form-group"><label className="label">{t("reg.gender")}</label>
                <div className="row">{["male", "female", "other"].map(g => <button type="button" key={g} className={`choice ${form.gender === g ? "on" : ""}`} onClick={() => setForm({ ...form, gender: g })}>{g === "other" ? t("reg.other") : t(`bmi.${g}`)}</button>)}</div></div>
              <div className="form-group"><label className="label">{t("reg.region")}</label>
                <select className="input" value={form.region} onChange={set("region")}>{REGIONS.map(r => <option key={r} value={r}>{t(`region.${r}`)}</option>)}</select></div>
            </div>
            <div className="form-group"><label className="label">{t("reg.diet")}</label>
              <div className="row">{["vegetarian", "non-vegetarian"].map(d => <button type="button" key={d} className={`choice ${form.dietType === d ? "on" : ""}`} onClick={() => setForm({ ...form, dietType: d })}>{d === "vegetarian" ? "🥦" : "🍗"} {t(`diet.${d}`)}</button>)}</div></div>
            <div className="form-group"><label className="label">{t("reg.goal")}</label>
              <div className="row">{["lose", "maintain", "gain"].map(g => <button type="button" key={g} className={`choice ${form.goal === g ? "on" : ""}`} onClick={() => setForm({ ...form, goal: g })}>{t(`goal.${g}`)}</button>)}</div></div>
            <div className="form-group"><label className="label">{t("reg.activity")}</label>
              <select className="input" value={form.activityLevel} onChange={set("activityLevel")}>{["sedentary", "light", "moderate", "active"].map(a => <option key={a} value={a}>{t(`act.${a}`)}</option>)}</select></div>
            <div className="form-group"><label className="label">⚕️ {t("reg.conditions")}</label>
              <ConditionPicker value={form.medicalConditions} onChange={v => setForm({ ...form, medicalConditions: v })} /></div>
            <button type="submit" className="btn btn-primary btn-block" disabled={saving}><Save size={16} /> {saving ? t("prof.saving") : t("prof.save")}</button>
          </form>

          <form className="card" onSubmit={changePw}>
            <h3 style={{ fontSize: 18, marginBottom: 16 }}><KeyRound size={18} style={{ verticalAlign: "-3px" }} /> {t("prof.password")}</h3>
            <div className="grid-2">
              <div className="form-group"><label className="label">{t("prof.current")}</label><input type="password" className="input" autoComplete="current-password" value={pw.currentPassword} onChange={e => setPw({ ...pw, currentPassword: e.target.value })} required /></div>
              <div className="form-group"><label className="label">{t("prof.new")}</label><input type="password" className="input" autoComplete="new-password" minLength={6} value={pw.newPassword} onChange={e => setPw({ ...pw, newPassword: e.target.value })} required /></div>
            </div>
            <button className="btn btn-secondary">{t("prof.update")}</button>
          </form>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card" style={{ textAlign: "center" }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", margin: "0 auto 12px", background: "linear-gradient(135deg,var(--orange-light),var(--yellow))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 700, color: "#fff" }}>{user?.name?.[0]?.toUpperCase()}</div>
            <h2 style={{ fontSize: 20, marginBottom: 2 }}>{user?.name}</h2>
            <p style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 12 }}>{user?.email}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center" }}>
              <span className="badge badge-green">{t(`diet.${form.dietType}`)}</span><span className="badge badge-orange">{t(`goal.${form.goal}.s`)}</span>
            </div>
            {target && <div style={{ marginTop: 16, padding: 12, background: "var(--green-mist)", borderRadius: 12 }}><div style={{ fontSize: 12, color: "var(--text-muted)" }}>{t("prof.calorieTarget")}</div><div className="serif" style={{ fontSize: 26, fontWeight: 700, color: "var(--green)" }}>{target} kcal</div></div>}
          </div>

          {active.length > 0 && (
            <div className="card">
              <h3 style={{ fontSize: 16, marginBottom: 12 }}>{t("prof.health")}</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {active.map(k => byKey[k] && (
                  <div key={k} style={{ padding: "11px 14px", background: "var(--bg)", borderRadius: 10, border: "1px solid var(--border)" }}>
                    <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 3 }}>{CONDITION_EMOJI[k]} {condLabel(byKey[k])}</div>
                    <div style={{ fontSize: 12.5, color: "var(--text-muted)" }}>{condTip(byKey[k])}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {bmi && (
            <div className="card">
              <h3 style={{ fontSize: 16, marginBottom: 12 }}>{t("prof.bmi")}</h3>
              <div style={{ textAlign: "center", marginBottom: 12 }}>
                <div className="serif" style={{ fontSize: 44, fontWeight: 700, color }}>{bmi}</div>
                <div style={{ fontWeight: 700, color }}>{t(`bmi.${cat}`)}</div>
              </div>
              {[["under", "< 18.5"], ["normal", "18.5 – 24.9"], ["over", "25 – 29.9"], ["obese", "≥ 30"]].map(([k, r]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "6px 10px", borderRadius: 8, background: cat === k ? `${BMI_COLOR[k]}18` : "transparent" }}>
                  <span style={{ fontSize: 13, color: cat === k ? BMI_COLOR[k] : "var(--text-muted)", fontWeight: cat === k ? 700 : 400 }}>{t(`bmi.${k}`)}</span><span style={{ fontSize: 13, color: "var(--text-muted)" }}>{r}</span>
                </div>
              ))}
            </div>
          )}

          <div style={{ padding: "18px 20px", background: "linear-gradient(135deg,var(--green),var(--green-dark))", borderRadius: 14, color: "#fff" }}>
            <div style={{ fontSize: 12, opacity: .8, marginBottom: 6 }}>{t("prof.tipTitle")}</div><div style={{ fontSize: 13.5, lineHeight: 1.6 }}>{tip}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
