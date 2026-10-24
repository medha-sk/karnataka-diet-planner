import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { ShieldCheck, Mail, Lock } from "lucide-react";

export default function AdminLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post("/api/admin/login", form);
      localStorage.setItem("kdp_admin_token", data.token);
      localStorage.setItem("kdp_admin_user", JSON.stringify(data));
      axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
      toast.success("Welcome, Admin! 🛡️");
      navigate("/admin/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally { setLoading(false); }
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
    }}>
      <div style={{ width: "100%", maxWidth: 420, padding: "0 20px" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{
            width: 72, height: 72,
            background: "linear-gradient(135deg, #e94560, #c62a47)",
            borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 16px", boxShadow: "0 8px 32px rgba(233,69,96,0.4)",
          }}>
            <ShieldCheck size={34} color="white" />
          </div>
          <h1 style={{ fontSize: 28, color: "white", marginBottom: 6, fontFamily:"Playfair Display,serif" }}>Admin Portal</h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14 }}>Karnataka Smart Diet Planner</p>
        </div>

        {/* Card */}
        <div style={{
          background: "rgba(255,255,255,0.07)", backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.12)", borderRadius: 20, padding: 32,
          boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
        }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 18 }}>
              <label style={{ display:"block", fontSize:12, fontWeight:600, color:"rgba(255,255,255,0.6)", marginBottom:8, textTransform:"uppercase", letterSpacing:1 }}>Admin Email</label>
              <div style={{ position:"relative" }}>
                <Mail size={16} style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:"rgba(255,255,255,0.4)" }} />
                <input
                  type="email" value={form.email}
                  onChange={e => setForm({...form, email:e.target.value})}
                  placeholder="admin@kdp.com" required
                  style={{
                    width:"100%", padding:"12px 12px 12px 38px",
                    background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.15)",
                    borderRadius:10, color:"white", fontSize:14, outline:"none",
                    fontFamily:"Plus Jakarta Sans,sans-serif",
                  }}
                />
              </div>
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display:"block", fontSize:12, fontWeight:600, color:"rgba(255,255,255,0.6)", marginBottom:8, textTransform:"uppercase", letterSpacing:1 }}>Password</label>
              <div style={{ position:"relative" }}>
                <Lock size={16} style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:"rgba(255,255,255,0.4)" }} />
                <input
                  type="password" value={form.password}
                  onChange={e => setForm({...form, password:e.target.value})}
                  placeholder="••••••••" required
                  style={{
                    width:"100%", padding:"12px 12px 12px 38px",
                    background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.15)",
                    borderRadius:10, color:"white", fontSize:14, outline:"none",
                    fontFamily:"Plus Jakarta Sans,sans-serif",
                  }}
                />
              </div>
            </div>
            <button
              type="submit" disabled={loading}
              style={{
                width:"100%", padding:"14px", borderRadius:10, border:"none",
                background: loading ? "rgba(233,69,96,0.5)" : "linear-gradient(135deg,#e94560,#c62a47)",
                color:"white", fontSize:15, fontWeight:700, cursor:"pointer",
                fontFamily:"Plus Jakarta Sans,sans-serif", letterSpacing:0.5,
                boxShadow: "0 4px 20px rgba(233,69,96,0.4)",
                transition:"all 0.2s",
              }}
            >
              {loading ? "Signing in..." : "Sign In to Admin 🛡️"}
            </button>
          </form>
        </div>

        <p style={{ textAlign:"center", marginTop:20, fontSize:13, color:"rgba(255,255,255,0.35)" }}>
          Default: admin@kdp.com / Admin@1234
        </p>
        <p style={{ textAlign:"center", marginTop:8, fontSize:13 }}>
          <a href="/" style={{ color:"rgba(255,255,255,0.5)", textDecoration:"none" }}>← Back to website</a>
        </p>
      </div>
    </div>
  );
}
