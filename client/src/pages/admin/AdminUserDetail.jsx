import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { ArrowLeft, Save, Trash2 } from "lucide-react";

const S = {
  label: { color:"rgba(255,255,255,0.4)", fontSize:11, fontWeight:600, textTransform:"uppercase", letterSpacing:0.8, display:"block", marginBottom:6 },
  val:   { color:"white", fontSize:14 },
  card:  { background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:14, padding:22 },
  input: {
    width:"100%", padding:"10px 12px",
    background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)",
    borderRadius:8, color:"white", fontSize:13, outline:"none",
    fontFamily:"Plus Jakarta Sans,sans-serif",
  },
};

export default function AdminUserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => {
    axios.get(`/api/admin/users/${id}`)
      .then(r => { setData(r.data); setForm(r.data.user); })
      .catch(() => toast.error("User not found"));
  }, [id]);

  const handleSave = async () => {
    try {
      await axios.put(`/api/admin/users/${id}`, form);
      toast.success("User updated ✅");
      setEditing(false);
      const r = await axios.get(`/api/admin/users/${id}`);
      setData(r.data); setForm(r.data.user);
    } catch { toast.error("Failed to update"); }
  };

  const handleDelete = async () => {
    if (!confirm(`Permanently delete "${data.user.name}"?`)) return;
    try {
      await axios.delete(`/api/admin/users/${id}`);
      toast.success("Deleted");
      navigate("/admin/users");
    } catch { toast.error("Failed"); }
  };

  if (!data) return <div style={{ color:"rgba(255,255,255,0.4)", padding:40 }}>Loading...</div>;
  const { user, trackers } = data;

  return (
    <div className="fade-in">
      <button onClick={() => navigate("/admin/users")} style={{ display:"flex", alignItems:"center", gap:6, background:"transparent", border:"none", color:"rgba(255,255,255,0.5)", cursor:"pointer", fontSize:14, marginBottom:20, padding:0 }}>
        <ArrowLeft size={16}/> Back to Users
      </button>

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:24 }}>
        <div>
          <div style={{ color:"white", fontSize:26, fontWeight:700, fontFamily:"Playfair Display,serif" }}>{user.name}</div>
          <div style={{ color:"rgba(255,255,255,0.4)", fontSize:13 }}>{user.email} · ID #{user.id}</div>
        </div>
        <div style={{ display:"flex", gap:10 }}>
          {editing ? (
            <>
              <button onClick={() => setEditing(false)} style={{ padding:"8px 16px", borderRadius:8, border:"1px solid rgba(255,255,255,0.15)", background:"transparent", color:"rgba(255,255,255,0.6)", cursor:"pointer", fontSize:13 }}>Cancel</button>
              <button onClick={handleSave} style={{ padding:"8px 16px", borderRadius:8, border:"none", background:"linear-gradient(135deg,#e94560,#c62a47)", color:"white", cursor:"pointer", fontSize:13, fontWeight:600, display:"flex", alignItems:"center", gap:6 }}><Save size={14}/> Save</button>
            </>
          ) : (
            <>
              <button onClick={() => setEditing(true)} style={{ padding:"8px 16px", borderRadius:8, border:"1px solid rgba(99,102,241,0.4)", background:"rgba(99,102,241,0.1)", color:"#818cf8", cursor:"pointer", fontSize:13 }}>Edit</button>
              <button onClick={handleDelete} style={{ padding:"8px 16px", borderRadius:8, border:"1px solid rgba(239,68,68,0.4)", background:"rgba(239,68,68,0.1)", color:"#ef4444", cursor:"pointer", fontSize:13, display:"flex", alignItems:"center", gap:6 }}><Trash2 size={14}/> Delete</button>
            </>
          )}
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginBottom:24 }}>
        {/* Profile Info */}
        <div style={S.card}>
          <div style={{ color:"rgba(255,255,255,0.7)", fontSize:14, fontWeight:600, marginBottom:18 }}>👤 Profile Details</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
            {editing ? (
              <>
                {[["Name","name","text"],["Age","age","number"],["Weight (kg)","weight","number"],["Height (cm)","height","number"]].map(([lbl,key,type]) => (
                  <div key={key}>
                    <label style={S.label}>{lbl}</label>
                    <input type={type} style={S.input} value={form[key]||""} onChange={e => setForm({...form,[key]:e.target.value})} />
                  </div>
                ))}
                <div>
                  <label style={S.label}>Goal</label>
                  <select style={S.input} value={form.goal||"maintain"} onChange={e => setForm({...form,goal:e.target.value})}>
                    <option value="lose">Weight Loss</option>
                    <option value="maintain">Maintain</option>
                    <option value="gain">Weight Gain</option>
                  </select>
                </div>
                <div>
                  <label style={S.label}>Status</label>
                  <select style={S.input} value={form.is_active} onChange={e => setForm({...form,is_active:parseInt(e.target.value)})}>
                    <option value={1}>Active</option>
                    <option value={0}>Inactive</option>
                  </select>
                </div>
              </>
            ) : (
              [
                ["Age", user.age ? `${user.age} yrs` : "—"],
                ["Weight", user.weight ? `${user.weight} kg` : "—"],
                ["Height", user.height ? `${user.height} cm` : "—"],
                ["BMI", user.bmi ? `${user.bmi} (${user.body_type})` : "—"],
                ["Goal", user.goal || "—"],
                ["Diet", user.diet_type || "—"],
                ["Region", user.region || "—"],
                ["Activity", user.activity_level || "—"],
                ["Medical", user.medical_conditions || "none"],
                ["Status", user.is_active ? "✅ Active" : "❌ Inactive"],
                ["Last Login", user.last_login ? new Date(user.last_login).toLocaleString() : "Never"],
                ["Joined", new Date(user.created_at).toLocaleDateString()],
              ].map(([lbl,val]) => (
                <div key={lbl}>
                  <span style={S.label}>{lbl}</span>
                  <span style={{ ...S.val, textTransform:"capitalize" }}>{val}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Tracker Summary */}
        <div style={S.card}>
          <div style={{ color:"rgba(255,255,255,0.7)", fontSize:14, fontWeight:600, marginBottom:18 }}>📊 Tracker Summary</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:18 }}>
            {[
              ["Total Days", trackers.length],
              ["Total Logs", trackers.length],
              ["Avg Calories", trackers.length ? Math.round(trackers.reduce((s,t)=>s+t.total_calories,0)/trackers.length) : 0],
              ["Avg Water", trackers.length ? Math.round(trackers.reduce((s,t)=>s+t.water_intake,0)/trackers.length) : 0],
            ].map(([lbl,val]) => (
              <div key={lbl} style={{ background:"rgba(255,255,255,0.04)", borderRadius:10, padding:14 }}>
                <div style={{ ...S.label, marginBottom:4 }}>{lbl}</div>
                <div style={{ color:"white", fontSize:22, fontWeight:700, fontFamily:"Playfair Display,serif" }}>{val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tracker Records Table */}
      <div style={S.card}>
        <div style={{ color:"rgba(255,255,255,0.7)", fontSize:14, fontWeight:600, marginBottom:18 }}>
          🗓️ Tracker Records (last 30 days)
        </div>
        {trackers.length === 0 ? (
          <p style={{ color:"rgba(255,255,255,0.3)", fontSize:13 }}>No records yet</p>
        ) : (
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
              <thead>
                <tr style={{ borderBottom:"1px solid rgba(255,255,255,0.08)" }}>
                  {["Date","Breakfast","Lunch","Dinner","Snack","Calories","Water","Notes"].map(h => (
                    <th key={h} style={{ padding:"10px 12px", textAlign:"left", color:"rgba(255,255,255,0.4)", fontWeight:600, fontSize:10, textTransform:"uppercase", letterSpacing:0.8 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {trackers.map(t => (
                  <tr key={t.id} style={{ borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
                    <td style={{ padding:"10px 12px", color:"white", fontWeight:500 }}>{t.date}</td>
                    <td style={{ padding:"10px 12px", color: t.breakfast_done?"#22c55e":"rgba(255,255,255,0.4)" }}>{t.breakfast_name||"—"} {t.breakfast_done?"✓":""}</td>
                    <td style={{ padding:"10px 12px", color: t.lunch_done?"#22c55e":"rgba(255,255,255,0.4)" }}>{t.lunch_name||"—"} {t.lunch_done?"✓":""}</td>
                    <td style={{ padding:"10px 12px", color: t.dinner_done?"#22c55e":"rgba(255,255,255,0.4)" }}>{t.dinner_name||"—"} {t.dinner_done?"✓":""}</td>
                    <td style={{ padding:"10px 12px", color: t.snack_done?"#22c55e":"rgba(255,255,255,0.4)" }}>{t.snack_name||"—"} {t.snack_done?"✓":""}</td>
                    <td style={{ padding:"10px 12px", color:"#f59e0b", fontWeight:600 }}>{t.total_calories}</td>
                    <td style={{ padding:"10px 12px", color:"#06b6d4" }}>{t.water_intake}💧</td>
                    <td style={{ padding:"10px 12px", color:"rgba(255,255,255,0.4)", maxWidth:120, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{t.notes||"—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
