import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Lock, ShieldCheck, Info } from "lucide-react";

const S = {
  card:  { background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:16, padding:28 },
  label: { display:"block", color:"rgba(255,255,255,0.5)", fontSize:11, fontWeight:600, textTransform:"uppercase", letterSpacing:0.8, marginBottom:8 },
  input: {
    width:"100%", padding:"11px 14px",
    background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)",
    borderRadius:10, color:"white", fontSize:14, outline:"none",
    fontFamily:"Plus Jakarta Sans,sans-serif", marginBottom:16,
  },
  btn: {
    padding:"11px 24px", borderRadius:10, border:"none",
    background:"linear-gradient(135deg,#e94560,#c62a47)",
    color:"white", fontSize:14, fontWeight:600, cursor:"pointer",
    fontFamily:"Plus Jakarta Sans,sans-serif",
  },
};

export default function AdminSettings() {
  const adminUser = JSON.parse(localStorage.getItem("kdp_admin_user") || "{}");
  const [pwForm, setPwForm] = useState({ currentPassword:"", newPassword:"", confirmPassword:"" });
  const [saving, setSaving] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword)
      return toast.error("New passwords don't match");
    if (pwForm.newPassword.length < 6)
      return toast.error("Password must be at least 6 characters");
    setSaving(true);
    try {
      await axios.put("/api/admin/change-password", {
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      });
      toast.success("Password updated ✅");
      setPwForm({ currentPassword:"", newPassword:"", confirmPassword:"" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update password");
    } finally { setSaving(false); }
  };

  return (
    <div className="fade-in">
      <div style={{ color:"white", fontSize:26, fontWeight:700, marginBottom:4, fontFamily:"Playfair Display,serif" }}>⚙️ Admin Settings</div>
      <p style={{ color:"rgba(255,255,255,0.4)", fontSize:14, marginBottom:28 }}>Manage your admin account</p>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:24, alignItems:"start" }}>
        {/* Admin Profile Card */}
        <div style={S.card}>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:24 }}>
            <ShieldCheck size={20} color="#e94560" />
            <span style={{ color:"white", fontWeight:600, fontSize:16 }}>Admin Profile</span>
          </div>
          <div style={{
            width:64, height:64, borderRadius:"50%",
            background:"linear-gradient(135deg,#e94560,#c62a47)",
            display:"flex", alignItems:"center", justifyContent:"center",
            color:"white", fontWeight:700, fontSize:26, marginBottom:16,
            boxShadow:"0 4px 20px rgba(233,69,96,0.4)",
          }}>
            {adminUser.name?.[0]?.toUpperCase() || "A"}
          </div>
          {[
            ["Name",      adminUser.name || "Admin"],
            ["Email",     adminUser.email || "—"],
            ["Role",      "Administrator"],
            ["User ID",   `#${adminUser.id || "—"}`],
          ].map(([lbl, val]) => (
            <div key={lbl} style={{ marginBottom:14 }}>
              <span style={S.label}>{lbl}</span>
              <span style={{ color:"white", fontSize:14 }}>{val}</span>
            </div>
          ))}
        </div>

        {/* Change Password */}
        <div style={S.card}>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:24 }}>
            <Lock size={20} color="#e94560" />
            <span style={{ color:"white", fontWeight:600, fontSize:16 }}>Change Password</span>
          </div>
          <form onSubmit={handlePasswordChange}>
            <label style={S.label}>Current Password</label>
            <input
              type="password" required style={S.input}
              value={pwForm.currentPassword}
              onChange={e => setPwForm({...pwForm, currentPassword:e.target.value})}
              placeholder="••••••••"
            />
            <label style={S.label}>New Password</label>
            <input
              type="password" required style={S.input}
              value={pwForm.newPassword}
              onChange={e => setPwForm({...pwForm, newPassword:e.target.value})}
              placeholder="Min 6 characters"
            />
            <label style={S.label}>Confirm New Password</label>
            <input
              type="password" required style={S.input}
              value={pwForm.confirmPassword}
              onChange={e => setPwForm({...pwForm, confirmPassword:e.target.value})}
              placeholder="Repeat new password"
            />
            <button type="submit" disabled={saving} style={{ ...S.btn, opacity:saving?0.6:1 }}>
              {saving ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>

        {/* Info Card */}
        <div style={{ ...S.card, gridColumn:"1/-1" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
            <Info size={20} color="#6366f1" />
            <span style={{ color:"white", fontWeight:600, fontSize:16 }}>System Information</span>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16 }}>
            {[
              ["Database",    "SQLite (kdp.db)",        "#22c55e"],
              ["Backend",     "Node.js + Express",      "#06b6d4"],
              ["Frontend",    "React + Vite",           "#f59e0b"],
              ["Auth",        "JWT (bcryptjs)",         "#a78bfa"],
              ["Version",     "v1.0.0",                 "#e94560"],
              ["Admin Route", "/admin",                 "#818cf8"],
              ["User Route",  "/dashboard",             "#22c55e"],
              ["API Base",    "/api",                   "#f59e0b"],
            ].map(([lbl, val, color]) => (
              <div key={lbl} style={{ background:"rgba(255,255,255,0.04)", borderRadius:10, padding:"14px 16px" }}>
                <div style={{ color:"rgba(255,255,255,0.4)", fontSize:10, fontWeight:600, textTransform:"uppercase", letterSpacing:0.8, marginBottom:6 }}>{lbl}</div>
                <div style={{ color, fontSize:13, fontWeight:600 }}>{val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
