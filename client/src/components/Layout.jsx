import { useState, useEffect } from "react";
import { Outlet, NavLink, useNavigate, useLocation, Link } from "react-router-dom";
import { LayoutDashboard, UtensilsCrossed, ClipboardList, User, LogOut, Menu, Home } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useLang } from "../context/LanguageContext";
import LanguageToggle from "./LanguageToggle";
import { Brand } from "./PublicLayout";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, key: "app.dashboard" },
  { to: "/diet-plan", icon: UtensilsCrossed, key: "app.plan" },
  { to: "/tracker", icon: ClipboardList, key: "app.tracker" },
  { to: "/profile", icon: User, key: "app.profile" },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  useEffect(() => { setOpen(false); window.scrollTo(0, 0); }, [pathname]);

  const handleLogout = () => { logout(); toast.success(t("app.loggedOut")); navigate("/"); };

  return (
    <div className="app-shell">
      <div className={`app-overlay ${open ? "open" : ""}`} onClick={() => setOpen(false)} />
      <aside className={`app-sidebar ${open ? "open" : ""}`}>
        <div style={{ padding: "22px 20px", borderBottom: "1px solid var(--border)" }}><Brand /></div>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 42, height: 42, borderRadius: "50%", background: "linear-gradient(135deg,var(--orange-light),var(--yellow))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
            {user?.name?.[0]?.toUpperCase()}</div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.name}</div>
            <div style={{ fontSize: 11.5, color: "var(--text-muted)" }}>{t(`goal.${user?.goal || "maintain"}.s`)} · {t(`diet.${user?.dietType || "vegetarian"}`)}</div>
          </div>
        </div>
        <nav style={{ flex: 1, padding: 12, overflowY: "auto" }}>
          {navItems.map(({ to, icon: Icon, key }) => (
            <NavLink key={to} to={to} className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}><Icon size={18} /> {t(key)}</NavLink>
          ))}
        </nav>
        <div style={{ padding: 12, borderTop: "1px solid var(--border)" }}>
          <div style={{ padding: "4px 14px 12px" }}><LanguageToggle /></div>
          <Link to="/" className="nav-item"><Home size={18} /> {t("app.website")}</Link>
          <button onClick={handleLogout} className="nav-item" style={{ marginBottom: 0 }}><LogOut size={18} /> {t("app.logout")}</button>
        </div>
      </aside>

      <div className="app-content">
        <div className="app-topbar">
          <button onClick={() => setOpen(true)} aria-label={t("nav.menu")} style={{ background: "none", border: "1px solid var(--border)", borderRadius: 10, width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><Menu size={20} /></button>
          <Brand /><LanguageToggle />
        </div>
        <main className="app-main"><Outlet /></main>
      </div>
    </div>
  );
}
