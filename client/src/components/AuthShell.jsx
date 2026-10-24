import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Brand } from "./PublicLayout";
import LanguageToggle from "./LanguageToggle";
import { useLang } from "../context/LanguageContext";

// Shared frame for Login / Register: green showcase panel + form area
export default function AuthShell({ children, wide = false, panelTitle, panelPoints }) {
  const { t } = useLang();
  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "linear-gradient(135deg,#f0faf4,#faf7f2 50%,#fef3e2)" }}>
      <aside className="auth-panel">
        <Brand light />
        <div style={{ margin: "auto 0" }}>
          <div style={{ fontSize: 70, marginBottom: 18 }}>🍛</div>
          <h2 style={{ color: "#fff", fontSize: 32, marginBottom: 22 }}>{panelTitle}</h2>
          {panelPoints.map(p => <div key={p} style={{ display: "flex", gap: 10, marginBottom: 12, fontSize: 15, opacity: .92 }}><span>✔</span><span>{p}</span></div>)}
        </div>
        <div style={{ fontSize: 12, opacity: .6 }}>{t("footer.disclaimer")}</div>
      </aside>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px" }}>
          <Link to="/" className="btn btn-secondary btn-sm"><ArrowLeft size={14} /> {t("login.back")}</Link>
          <LanguageToggle />
        </div>
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "10px 20px 40px" }}>
          <div style={{ width: "100%", maxWidth: wide ? 600 : 430 }} className="fade-in">{children}</div>
        </div>
      </div>
      <style>{`.auth-panel{width:42%;max-width:520px;background:linear-gradient(160deg,#2d6a4f,#1b4332);padding:36px 44px;display:flex;flex-direction:column;color:#fff}
      @media(max-width:900px){.auth-panel{display:none}}`}</style>
    </div>
  );
}
