import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useLang } from "../context/LanguageContext";
import AuthShell from "../components/AuthShell";

export default function Login() {
  const { t } = useLang();
  const [form, setForm] = useState({ email: "", password: "" });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const { data } = await axios.post("/api/auth/login", form);
      if (data.role === "admin") { toast.error("Admins sign in at /admin/login"); return; }
      login(data);
      toast.success(`${t("login.greet")}, ${data.name}! 🙏`);
      navigate("/dashboard");
    } catch (err) { toast.error(err.response?.data?.message || "Login failed"); }
    finally { setLoading(false); }
  };

  return (
    <AuthShell panelTitle={t("hero.title1") + " " + t("hero.title2")} panelPoints={[t("f1.t"), t("f2.t"), t("f3.t"), t("f5.t")]}>
      <div style={{ textAlign: "center", marginBottom: 26 }}>
        <h1 style={{ fontSize: 30, color: "var(--green)", marginBottom: 6 }}>{t("login.title")}</h1>
        <p style={{ color: "var(--text-muted)", fontSize: 14 }}>{t("login.sub")}</p>
      </div>
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group"><label className="label" htmlFor="l-e">{t("login.email")}</label>
            <div className="input-icon"><Mail size={16} /><input id="l-e" type="email" className="input" placeholder="you@example.com" autoComplete="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required /></div></div>
          <div className="form-group"><label className="label" htmlFor="l-p">{t("login.password")}</label>
            <div className="input-icon"><Lock size={16} />
              <input id="l-p" type={show ? "text" : "password"} className="input" placeholder="••••••••" autoComplete="current-password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required style={{ paddingRight: 44 }} />
              <button type="button" onClick={() => setShow(s => !s)} aria-label={show ? t("login.hide") : t("login.show")}
                style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex", padding: 6 }}>
                {show ? <EyeOff size={16} /> : <Eye size={16} />}</button></div></div>
          <button type="submit" className="btn btn-primary btn-block btn-lg" style={{ marginTop: 6 }} disabled={loading}>{loading ? t("login.busy") : `${t("login.btn")} 🌿`}</button>
        </form>
      </div>
      <p style={{ textAlign: "center", marginTop: 20, fontSize: 14, color: "var(--text-muted)" }}>
        {t("login.new")} <Link to="/register" style={{ color: "var(--green)", fontWeight: 700, textDecoration: "none" }}>{t("login.create")}</Link>
      </p>
    </AuthShell>
  );
}
