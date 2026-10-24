import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { ArrowRight, ChevronDown, Send, Shuffle } from "lucide-react";
import { useLang } from "../../context/LanguageContext";
import { useAuth } from "../../context/AuthContext";
import BMICalculator from "../../components/BMICalculator";
import { CONDITION_EMOJI, MEAL_ICONS } from "../../utils/health";

const FEATURES = [
  { k: "f1", e: "🍛", bg: "#d8f3dc" }, { k: "f2", e: "⚕️", bg: "#fde8df" }, { k: "f3", e: "✅", bg: "#e0f2fe" },
  { k: "f4", e: "💧", bg: "#cffafe" }, { k: "f5", e: "🌐", bg: "#fef3c7" }, { k: "f6", e: "📊", bg: "#ede9fe" },
];
const SUPERFOODS = [
  { k: "sf1", e: "🌾", bg: "linear-gradient(135deg,#7c4a1e,#b9722f)" }, { k: "sf2", e: "🫓", bg: "linear-gradient(135deg,#2d6a4f,#52b788)" },
  { k: "sf3", e: "🫘", bg: "linear-gradient(135deg,#9a3412,#e76f51)" }, { k: "sf4", e: "🥥", bg: "linear-gradient(135deg,#0f766e,#2dd4bf)" },
  { k: "sf5", e: "🌿", bg: "linear-gradient(135deg,#4d7c0f,#a3c94b)" }, { k: "sf6", e: "🐟", bg: "linear-gradient(135deg,#1d4ed8,#60a5fa)" },
];
const REGIONS = [{ k: "r1", e: "🍚" }, { k: "r2", e: "🦐" }, { k: "r3", e: "🫓" }, { k: "r4", e: "🌴" }];
const MEAL_ORDER = ["breakfast", "lunch", "dinner", "snack"];

function Head({ eyebrow, title, sub }) {
  return (
    <div className="section-head">
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2>{title}</h2>{sub && <p>{sub}</p>}
    </div>
  );
}

function Counter({ value }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let raf, start;
    const dur = 900;
    const step = (ts) => { start ??= ts; const p = Math.min(1, (ts - start) / dur); setN(Math.round(value * p)); if (p < 1) raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return <>{n.toLocaleString()}</>;
}

function SamplePlan() {
  const { t, lang } = useLang();
  const [diet, setDiet] = useState("vegetarian");
  const [goal, setGoal] = useState("maintain");
  const [shuffle, setShuffle] = useState(0);
  const [meals, setMeals] = useState([]);

  useEffect(() => {
    axios.get(`/api/public/meals?diet=${diet}&goal=${goal}`).then(r => setMeals(r.data)).catch(() => {});
  }, [diet, goal]);

  const day = MEAL_ORDER.map(type => {
    const list = meals.filter(m => m.mealType === type);
    return list.length ? list[shuffle % list.length] : null;
  }).filter(Boolean);
  const total = day.reduce((s, m) => s + m.calories, 0);

  return (
    <div className="try-box">
      <div>
        <div className="form-group"><label className="label">{t("try.diet")}</label>
          <div className="row">{["vegetarian", "non-vegetarian"].map(d => <button key={d} className={`choice ${diet === d ? "on" : ""}`} onClick={() => { setDiet(d); setShuffle(0); }}>{d === "vegetarian" ? "🥦" : "🍗"} {t(`diet.${d}`)}</button>)}</div></div>
        <div className="form-group"><label className="label">{t("try.goal")}</label>
          <div className="row" style={{ flexDirection: "column" }}>{["lose", "maintain", "gain"].map(g => <button key={g} className={`choice ${goal === g ? "on" : ""}`} onClick={() => { setGoal(g); setShuffle(0); }}>{t(`goal.${g}`)}<small>{t(`goal.${g}.d`)}</small></button>)}</div></div>
        <button className="btn btn-secondary btn-block" onClick={() => setShuffle(s => s + 1)}><Shuffle size={15} /> {t("try.shuffle")}</button>
      </div>
      <div>
        <div className="try-meals">
          {day.map(m => (
            <div key={m.id} className="try-meal fade-in">
              <div className="try-ic">{MEAL_ICONS[m.mealType]}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{t(`meal.${m.mealType}`)}</div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{lang === "kn" && m.nameKn ? m.nameKn : m.name}</div>
                <div style={{ fontSize: 12.5, color: "var(--text-muted)" }}>{lang === "kn" && m.descriptionKn ? m.descriptionKn : m.description}</div>
              </div>
              <div style={{ textAlign: "right" }}><div className="serif" style={{ fontWeight: 700, fontSize: 20, color: "var(--green)" }}>{m.calories}</div><div style={{ fontSize: 11, color: "var(--text-muted)" }}>kcal</div></div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16, flexWrap: "wrap", gap: 12 }}>
          <div><span style={{ color: "var(--text-muted)", fontSize: 13 }}>{t("try.total")}: </span><b className="serif" style={{ fontSize: 24, color: "var(--green)" }}>{total} kcal</b></div>
          <Link to="/register" className="btn btn-primary">{t("try.cta")} <ArrowRight size={16} /></Link>
        </div>
      </div>
    </div>
  );
}

function Conditions() {
  const { t, condLabel, condTip } = useLang();
  const [list, setList] = useState([]);
  useEffect(() => { axios.get("/api/public/conditions").then(r => setList(r.data.filter(c => c.key !== "none"))).catch(() => {}); }, []);
  return (
    <div className="cond-grid">
      {list.map(c => (
        <div className="cond-card" key={c.key}>
          <div className="cond-ic">{CONDITION_EMOJI[c.key]}</div>
          <div>
            <h4>{condLabel(c)}</h4>
            <p>{condTip(c)}</p>
            {c.warningFoods.length > 0 && <div className="meta"><span className="badge badge-orange">{c.warningFoods.length} {t("health.flagged")}</span></div>}
          </div>
        </div>
      ))}
    </div>
  );
}

function FAQ() {
  const { t } = useLang();
  const [open, setOpen] = useState(0);
  return (
    <div className="faq">
      {[1, 2, 3, 4, 5, 6].map((n, i) => (
        <div key={n} className={`faq-item ${open === i ? "open" : ""}`}>
          <button className="faq-q" onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>{t(`q${n}`)}<ChevronDown size={20} /></button>
          <div className="faq-a"><div>{t(`a${n}`)}</div></div>
        </div>
      ))}
    </div>
  );
}

function Contact() {
  const { t } = useLang();
  const [f, setF] = useState({ name: "", email: "", subject: "", message: "" });
  const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault(); setBusy(true);
    try {
      await axios.post("/api/public/contact", f);
      toast.success(t("contact.sent")); setF({ name: "", email: "", subject: "", message: "" });
    } catch (err) { toast.error(err.response?.data?.message || "Error"); }
    finally { setBusy(false); }
  };
  const up = (k) => (e) => setF({ ...f, [k]: e.target.value });
  return (
    <div className="contact-box">
      <div>
        <span className="eyebrow">{t("nav.contact")}</span>
        <h2 style={{ fontSize: 34, color: "var(--green-dark)", marginBottom: 12 }}>{t("contact.title")}</h2>
        <p style={{ color: "var(--text-muted)", marginBottom: 20 }}>{t("contact.sub")}</p>
        <div style={{ fontSize: 56 }}>🙏</div>
      </div>
      <form className="card" onSubmit={submit}>
        <div className="grid-2">
          <div className="form-group"><label className="label" htmlFor="c-n">{t("contact.name")}</label><input id="c-n" className="input" value={f.name} onChange={up("name")} required /></div>
          <div className="form-group"><label className="label" htmlFor="c-e">{t("contact.email")}</label><input id="c-e" type="email" className="input" value={f.email} onChange={up("email")} required /></div>
        </div>
        <div className="form-group"><label className="label" htmlFor="c-s">{t("contact.subject")}</label><input id="c-s" className="input" value={f.subject} onChange={up("subject")} /></div>
        <div className="form-group"><label className="label" htmlFor="c-m">{t("contact.message")}</label><textarea id="c-m" rows={4} className="input" value={f.message} onChange={up("message")} required style={{ resize: "vertical" }} /></div>
        <button className="btn btn-primary btn-block" disabled={busy}><Send size={16} /> {busy ? t("contact.sending") : t("contact.send")}</button>
      </form>
    </div>
  );
}

export default function Home() {
  const { t } = useLang();
  const { user } = useAuth();
  const [info, setInfo] = useState({ meals: 0, conditions: 0, members: 0, logs: 0 });
  useEffect(() => { axios.get("/api/public/info").then(r => setInfo(r.data)).catch(() => {}); }, []);
  const ctaTo = user ? "/dashboard" : "/register";

  return (
    <>
      {/* HERO */}
      <section className="hero" id="top">
        <div className="container hero-grid">
          <div className="fade-in">
            <span className="hero-badge">{t("hero.badge")}</span>
            <h1>{t("hero.title1")} <em>{t("hero.title2")}</em></h1>
            <p className="lead">{t("hero.sub")}</p>
            <div className="hero-cta">
              <Link to={ctaTo} className="btn btn-primary btn-lg">{user ? t("nav.dashboard") : t("hero.cta1")} <ArrowRight size={18} /></Link>
              <Link to="/foods" className="btn btn-ghost btn-lg">{t("hero.cta2")}</Link>
            </div>
            <div className="hero-trust">✔ {t("hero.trust")}</div>
          </div>
          <div className="hero-visual" aria-hidden="true">
            <div className="plate">
              <div className="plate-inner">🍛</div>
              <span className="plate-item" style={{ top: "6%", left: "12%", animationDelay: "0s" }}>🫓</span>
              <span className="plate-item" style={{ top: "10%", right: "8%", animationDelay: "1s" }}>🥥</span>
              <span className="plate-item" style={{ bottom: "8%", left: "8%", animationDelay: "2s" }}>🌾</span>
              <span className="plate-item" style={{ bottom: "6%", right: "14%", animationDelay: "3s" }}>🥬</span>
            </div>
            <div className="float-card" style={{ top: "4%", left: "-4%" }}><div className="float-ic" style={{ background: "#d8f3dc" }}>🍽️</div><div><span className="l">{t("hero.card1")}</span><b>{t("hero.card1v")}</b></div></div>
            <div className="float-card" style={{ top: "44%", right: "-6%", animationDelay: "1.5s" }}><div className="float-ic" style={{ background: "#e0f2fe" }}>💧</div><div><span className="l">{t("hero.card2")}</span><b>{t("hero.card2v")}</b></div></div>
            <div className="float-card" style={{ bottom: "4%", left: "2%", animationDelay: "3s" }}><div className="float-ic" style={{ background: "#fde8df" }}>🔥</div><div><span className="l">{t("hero.card3")}</span><b>{t("hero.card3v")}</b></div></div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <div className="container stats-strip">
        <div className="stats-grid">
          <div><div className="n"><Counter value={info.meals} /></div><div className="l">{t("hero.stat.meals")}</div></div>
          <div><div className="n"><Counter value={info.conditions} /></div><div className="l">{t("hero.stat.conditions")}</div></div>
          <div><div className="n"><Counter value={info.members} /></div><div className="l">{t("hero.stat.members")}</div></div>
          <div><div className="n"><Counter value={info.logs} /></div><div className="l">{t("hero.stat.logs")}</div></div>
        </div>
      </div>

      {/* FEATURES */}
      <section className="section" id="features">
        <div className="container">
          <Head eyebrow={t("nav.features")} title={t("feat.title")} sub={t("feat.sub")} />
          <div className="feature-grid">
            {FEATURES.map(f => (
              <div className="feature" key={f.k}>
                <div className="feature-ic" style={{ background: f.bg }}>{f.e}</div>
                <h3>{t(`${f.k}.t`)}</h3><p>{t(`${f.k}.d`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW */}
      <section className="section alt" id="how">
        <div className="container">
          <Head eyebrow={t("nav.how")} title={t("how.title")} sub={t("how.sub")} />
          <div className="steps">
            {[1, 2, 3].map(n => <div className="step" key={n}><div className="step-n">{n}</div><h3>{t(`s${n}.t`)}</h3><p>{t(`s${n}.d`)}</p></div>)}
          </div>
        </div>
      </section>

      {/* TRY */}
      <section className="section tint" id="try">
        <div className="container">
          <Head eyebrow="✨ Demo" title={t("try.title")} sub={t("try.sub")} />
          <SamplePlan />
        </div>
      </section>

      {/* SUPERFOODS */}
      <section className="section" id="superfoods">
        <div className="container">
          <Head title={t("sf.title")} sub={t("sf.sub")} />
          <div className="sf-grid">
            {SUPERFOODS.map(s => <div className="sf-card" key={s.k} style={{ background: s.bg }}><span className="em">{s.e}</span><h3>{t(`${s.k}.t`)}</h3><p>{t(`${s.k}.d`)}</p></div>)}
          </div>
        </div>
      </section>

      {/* REGIONS */}
      <section className="section alt" id="regions">
        <div className="container">
          <Head title={t("reg.title")} sub={t("reg.sub")} />
          <div className="reg-grid">
            {REGIONS.map(r => <div className="reg-card" key={r.k}><div className="em">{r.e}</div><h3>{t(`${r.k}.t`)}</h3><p>{t(`${r.k}.d`)}</p></div>)}
          </div>
        </div>
      </section>

      {/* HEALTH */}
      <section className="section tint" id="health">
        <div className="container">
          <Head eyebrow={t("nav.health")} title={t("health.title")} sub={t("health.sub")} />
          <Conditions />
        </div>
      </section>

      {/* BMI */}
      <section className="section" id="bmi">
        <div className="container">
          <Head eyebrow={t("nav.bmi")} title={t("bmi.title")} sub={t("bmi.sub")} />
          <BMICalculator />
        </div>
      </section>

      {/* FAQ */}
      <section className="section alt" id="faq">
        <div className="container"><Head eyebrow={t("nav.faq")} title={t("faq.title")} /><FAQ /></div>
      </section>

      {/* CONTACT */}
      <section className="section" id="contact"><div className="container"><Contact /></div></section>

      {/* CTA */}
      <section style={{ padding: "0 0 80px" }}>
        <div className="container">
          <div className="cta-band">
            <h2>{t("cta.title")}</h2><p>{t("cta.sub")}</p>
            <Link to={ctaTo} className="btn btn-white btn-lg">{user ? t("nav.dashboard") : t("hero.cta1")} <ArrowRight size={18} /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
