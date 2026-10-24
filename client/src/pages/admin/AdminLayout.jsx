import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  LayoutDashboard, Users, ClipboardList, Database,
  Settings, LogOut, ShieldCheck, Utensils, Mail
} from "lucide-react";

const navItems = [
  { to:"/admin/dashboard", icon:LayoutDashboard, label:"Dashboard" },
  { to:"/admin/users",     icon:Users,           label:"Users" },
  { to:"/admin/trackers",  icon:ClipboardList,   label:"Tracker Records" },
  { to:"/admin/meals",     icon:Utensils,        label:"Food Catalogue" },
  { to:"/admin/messages",  icon:Mail,            label:"Messages" },
  { to:"/admin/database",  icon:Database,        label:"Database Viewer" },
  { to:"/admin/settings",  icon:Settings,        label:"Settings" },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const adminUser = JSON.parse(localStorage.getItem("kdp_admin_user") || "{}");

  const [unread, setUnread] = useState(0);
  useEffect(() => {
    const token = localStorage.getItem("kdp_admin_token");
    if (token) axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    const load = () => axios.get("/api/admin/messages").then(r => setUnread(r.data.unread)).catch(err => {
      if (err.response?.status === 401) { localStorage.removeItem("kdp_admin_token"); navigate("/admin/login"); }
    });
    load();
    window.addEventListener("kdp-messages-changed", load);
    return () => window.removeEventListener("kdp-messages-changed", load);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("kdp_admin_token");
    localStorage.removeItem("kdp_admin_user");
    delete axios.defaults.headers.common["Authorization"];
    toast.success("Logged out");
    navigate("/admin/login");
  };

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:"#0f0f1a" }}>
      {/* Sidebar */}
      <aside style={{
        width: 260, position:"fixed", top:0, left:0, bottom:0,
        background:"linear-gradient(180deg,#1a1a2e 0%,#16213e 100%)",
        borderRight:"1px solid rgba(255,255,255,0.08)",
        display:"flex", flexDirection:"column", zIndex:100,
      }}>
        {/* Logo */}
        <div style={{ padding:"24px 20px", borderBottom:"1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{
              width:42, height:42,
              background:"linear-gradient(135deg,#e94560,#c62a47)",
              borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center",
              boxShadow:"0 4px 16px rgba(233,69,96,0.4)",
            }}>
              <ShieldCheck size={22} color="white" />
            </div>
            <div>
              <div style={{ color:"white", fontWeight:700, fontSize:15, fontFamily:"Playfair Display,serif" }}>KDP Admin</div>
              <div style={{ color:"rgba(255,255,255,0.4)", fontSize:11 }}>Control Panel</div>
            </div>
          </div>
        </div>

        {/* Admin Info */}
        <div style={{ padding:"16px 20px", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
          <div style={{
            width:38, height:38, borderRadius:"50%",
            background:"linear-gradient(135deg,#e94560,#c62a47)",
            display:"flex", alignItems:"center", justifyContent:"center",
            color:"white", fontWeight:700, fontSize:16, marginBottom:8,
          }}>
            {adminUser.name?.[0]?.toUpperCase() || "A"}
          </div>
          <div style={{ color:"white", fontSize:13, fontWeight:600 }}>{adminUser.name || "Admin"}</div>
          <div style={{ color:"rgba(255,255,255,0.4)", fontSize:11 }}>{adminUser.email}</div>
        </div>

        {/* Nav */}
        <nav style={{ flex:1, padding:"12px 10px", overflowY:"auto" }}>
          {navItems.map(({ to, icon:Icon, label }) => (
            <NavLink key={to} to={to} style={({ isActive }) => ({
              display:"flex", alignItems:"center", gap:12,
              padding:"11px 14px", borderRadius:10, marginBottom:4,
              textDecoration:"none", fontSize:14, fontWeight:500, transition:"all 0.2s",
              color: isActive ? "white" : "rgba(255,255,255,0.5)",
              background: isActive ? "rgba(233,69,96,0.2)" : "transparent",
              borderLeft: isActive ? "3px solid #e94560" : "3px solid transparent",
            })}>
              <Icon size={17} />
              <span style={{ flex:1 }}>{label}</span>
              {to === "/admin/messages" && unread > 0 && <span style={{ background:"#e94560", color:"#fff", borderRadius:10, fontSize:11, fontWeight:700, padding:"1px 8px" }}>{unread}</span>}
            </NavLink>
          ))}
        </nav>

        {/* View User App */}
        <div style={{ padding:"10px" }}>
          <a href="/" target="_blank" rel="noreferrer" style={{
            display:"flex", alignItems:"center", gap:10,
            padding:"10px 14px", borderRadius:10, marginBottom:4,
            background:"rgba(45,106,79,0.2)", border:"1px solid rgba(45,106,79,0.3)",
            color:"#52b788", textDecoration:"none", fontSize:13, fontWeight:500,
          }}>
            🌿 View Website
          </a>
          <button onClick={handleLogout} style={{
            display:"flex", alignItems:"center", gap:10, width:"100%",
            padding:"10px 14px", borderRadius:10, border:"none",
            background:"transparent", color:"rgba(255,255,255,0.4)",
            fontSize:13, cursor:"pointer", transition:"all 0.2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(233,69,96,0.15)"; e.currentTarget.style.color = "#e94560"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.4)"; }}
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ marginLeft:260, flex:1, padding:"32px", minHeight:"100vh", background:"#0f0f1a" }}>
        <Outlet />
      </main>
    </div>
  );
}
