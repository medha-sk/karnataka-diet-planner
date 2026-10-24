import { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Leaf, Menu, X, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useLang } from "../context/LanguageContext";
import LanguageToggle from "./LanguageToggle";

const LINKS = [
  { to: "/", key: "nav.home" },
  { to: "/#features", key: "nav.features" },
  { to: "/#how", key: "nav.how" },
  { to: "/foods", key: "nav.foods" },
  { to: "/#health", key: "nav.health" },
  { to: "/#bmi", key: "nav.bmi" },
  { to: "/#faq", key: "nav.faq" },
  { to: "/#contact", key: "nav.contact" },
];

export function Brand({ light = false }) {
  const { t } = useLang();
  return (
    <Link to="/" className="brand">
      <div className="brand-logo"><Leaf size={20} color="white" /></div>
      <div>
        <div className="brand-name" style={light ? { color: "#fff" } : null}>{t("brand.short")}</div>
        <div className="brand-sub" style={light ? { color: "rgba(255,255,255,.6)" } : null}>{lang_en_or_kn(t)}</div>
      </div>
    </Link>
  );
}
const lang_en_or_kn = (t) => t("brand.name").replace(t("brand.short"), "").trim();

export default function PublicLayout() {
  const { t } = useLang();
  const { user } = useAuth();
  const { pathname, hash } = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 10);
    on(); window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  // scroll to #section after navigating (works from /foods → /#faq too)
  useEffect(() => {
    setOpen(false);
    if (hash) {
      const id = hash.slice(1);
      const tryScroll = (n = 0) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        else if (n < 10) setTimeout(() => tryScroll(n + 1), 80);
      };
      tryScroll();
    } else window.scrollTo({ top: 0 });
  }, [pathname, hash]);

  const isActive = (to) => (to === "/" ? pathname === "/" && !hash : to === "/foods" ? pathname === "/foods" : hash && to === `/${hash}`);

  return (
    <>
      <header className={`site-nav ${scrolled ? "scrolled" : ""}`}>
        <div className="container nav-inner">
          <Brand />
          <nav className="nav-links" aria-label="Main">
            {LINKS.map(l => <Link key={l.to} to={l.to} className={`nav-link ${isActive(l.to) ? "active" : ""}`}>{t(l.key)}</Link>)}
          </nav>
          <div className="nav-actions">
            <LanguageToggle />
            {user ? (
              <Link to="/dashboard" className="btn btn-primary">{t("nav.dashboard")}</Link>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost btn-sm">{t("nav.login")}</Link>
                <Link to="/register" className="btn btn-primary btn-sm">{t("nav.signup")}</Link>
              </>
            )}
            <button className="nav-burger" onClick={() => setOpen(o => !o)} aria-label={t("nav.menu")} aria-expanded={open}>
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
        <div className={`mobile-menu ${open ? "open" : ""}`}>
          {LINKS.map(l => <Link key={l.to} to={l.to}>{t(l.key)}</Link>)}
          {!user && <Link to="/login">{t("nav.login")}</Link>}
        </div>
      </header>

      <main><Outlet /></main>

      <footer className="site-footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <Brand light />
              <p style={{ marginTop: 14, fontSize: 14, maxWidth: 340 }}>{t("footer.about")}</p>
            </div>
            <div>
              <h4>{t("footer.explore")}</h4>
              <Link to="/#features">{t("nav.features")}</Link>
              <Link to="/foods">{t("nav.foods")}</Link>
              <Link to="/#bmi">{t("nav.bmi")}</Link>
              <Link to="/#faq">{t("nav.faq")}</Link>
            </div>
            <div>
              <h4>{t("footer.account")}</h4>
              <Link to="/login">{t("nav.login")}</Link>
              <Link to="/register">{t("nav.signup")}</Link>
              <Link to="/admin/login" style={{ display: "flex", alignItems: "center", gap: 6 }}><ShieldCheck size={14} /> {t("nav.admin")}</Link>
              <div style={{ marginTop: 12 }}><LanguageToggle dark /></div>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} {t("brand.name")}. {t("footer.rights")}</span>
            <span>{t("footer.disclaimer")}</span>
          </div>
        </div>
      </footer>
    </>
  );
}
