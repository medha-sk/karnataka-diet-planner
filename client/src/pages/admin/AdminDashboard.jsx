import { useEffect, useState } from "react";
import axios from "axios";
import { Users, ClipboardList, TrendingUp, Activity, UserCheck, UserPlus } from "lucide-react";

const S = {
  title: { color:"white", fontSize:26, fontWeight:700, marginBottom:4, fontFamily:"Playfair Display,serif" },
  sub:   { color:"rgba(255,255,255,0.4)", fontSize:14, marginBottom:28 },
  card:  { background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:16, padding:24 },
  label: { color:"rgba(255,255,255,0.5)", fontSize:12, fontWeight:600, textTransform:"uppercase", letterSpacing:0.8, marginBottom:8 },
  val:   { color:"white", fontSize:34, fontWeight:700, fontFamily:"Playfair Display,serif" },
  tag:   { display:"inline-block", padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:600 },
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/api/admin/stats")
      .then(r => setStats(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ color:"rgba(255,255,255,0.4)", padding:40 }}>Loading dashboard...</div>;
  if (!stats) return <div style={{ color:"#e94560", padding:40 }}>Failed to load stats.</div>;

  const statCards = [
    { label:"Total Users",     value:stats.totalUsers,    icon:Users,         color:"#6366f1", bg:"rgba(99,102,241,0.15)" },
    { label:"Active Users",    value:stats.activeUsers,   icon:UserCheck,     color:"#22c55e", bg:"rgba(34,197,94,0.15)" },
    { label:"New Today",       value:stats.newUsersToday, icon:UserPlus,      color:"#f59e0b", bg:"rgba(245,158,11,0.15)" },
    { label:"New This Week",   value:stats.newUsersWeek,  icon:TrendingUp,    color:"#06b6d4", bg:"rgba(6,182,212,0.15)" },
    { label:"Total Logs",      value:stats.totalTrackers, icon:ClipboardList, color:"#e94560", bg:"rgba(233,69,96,0.15)" },
    { label:"Logged Today",    value:stats.todayTrackers, icon:Activity,      color:"#a78bfa", bg:"rgba(167,139,250,0.15)" },
  ];

  return (
    <div className="fade-in">
      <div style={S.title}>📊 Admin Dashboard</div>
      <p style={S.sub}>Karnataka Smart Diet Planner — Control Panel</p>

      {/* Stat Cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, marginBottom:28 }}>
        {statCards.map(({ label, value, icon:Icon, color, bg }) => (
          <div key={label} style={S.card}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
              <div style={S.label}>{label}</div>
              <div style={{ width:38, height:38, background:bg, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Icon size={18} color={color} />
              </div>
            </div>
            <div style={{ ...S.val, color }}>{value}</div>
          </div>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:20, marginBottom:24 }}>
        {/* Goal Breakdown */}
        <div style={S.card}>
          <div style={{ ...S.label, marginBottom:16 }}>Users by Goal</div>
          {stats.goalBreakdown?.map(g => (
            <div key={g.goal} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
              <span style={{ color:"rgba(255,255,255,0.7)", fontSize:14, textTransform:"capitalize" }}>
                {g.goal === "lose" ? "⬇ Weight Loss" : g.goal === "gain" ? "⬆ Weight Gain" : "⚖ Maintain"}
              </span>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <div style={{ width:80, height:6, background:"rgba(255,255,255,0.1)", borderRadius:3 }}>
                  <div style={{ width:`${Math.min((g.count/Math.max(stats.totalUsers,1))*100,100)}%`, height:"100%", background:"#6366f1", borderRadius:3 }} />
                </div>
                <span style={{ color:"white", fontSize:13, fontWeight:600, minWidth:20 }}>{g.count}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Diet Breakdown */}
        <div style={S.card}>
          <div style={{ ...S.label, marginBottom:16 }}>Diet Preference</div>
          {stats.dietBreakdown?.map(d => (
            <div key={d.diet_type} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
              <span style={{ color:"rgba(255,255,255,0.7)", fontSize:14, textTransform:"capitalize" }}>
                {d.diet_type === "vegetarian" ? "🥦 Vegetarian" : "🍗 Non-Veg"}
              </span>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <div style={{ width:80, height:6, background:"rgba(255,255,255,0.1)", borderRadius:3 }}>
                  <div style={{ width:`${Math.min((d.count/Math.max(stats.totalUsers,1))*100,100)}%`, height:"100%", background:"#22c55e", borderRadius:3 }} />
                </div>
                <span style={{ color:"white", fontSize:13, fontWeight:600 }}>{d.count}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Body Type */}
        <div style={S.card}>
          <div style={{ ...S.label, marginBottom:16 }}>Body Type</div>
          {stats.bodyBreakdown?.length ? stats.bodyBreakdown.map(b => {
            const colors = { underweight:"#06b6d4", normal:"#22c55e", overweight:"#f59e0b" };
            return (
              <div key={b.body_type} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
                <span style={{ color:"rgba(255,255,255,0.7)", fontSize:14, textTransform:"capitalize" }}>{b.body_type}</span>
                <span style={{ ...S.tag, background:`${colors[b.body_type]}22`, color:colors[b.body_type] }}>{b.count}</span>
              </div>
            );
          }) : <p style={{ color:"rgba(255,255,255,0.3)", fontSize:13 }}>No BMI data yet</p>}

          <div style={{ marginTop:16, paddingTop:16, borderTop:"1px solid rgba(255,255,255,0.08)" }}>
            <div style={S.label}>Avg Daily Calories</div>
            <div style={{ color:"#f59e0b", fontSize:24, fontWeight:700, fontFamily:"Playfair Display,serif" }}>
              {stats.avgCalories || 0} <span style={{ fontSize:13, color:"rgba(255,255,255,0.4)" }}>kcal</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
        {/* Recent Signups */}
        <div style={S.card}>
          <div style={{ ...S.label, marginBottom:16 }}>Recent Signups</div>
          {stats.recentSignups?.length ? stats.recentSignups.map(u => (
            <div key={u.id} style={{
              display:"flex", alignItems:"center", gap:12, padding:"10px 0",
              borderBottom:"1px solid rgba(255,255,255,0.05)",
            }}>
              <div style={{
                width:34, height:34, borderRadius:"50%",
                background:"linear-gradient(135deg,#6366f1,#8b5cf6)",
                display:"flex", alignItems:"center", justifyContent:"center",
                color:"white", fontWeight:700, fontSize:14,
              }}>
                {u.name[0].toUpperCase()}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ color:"white", fontSize:13, fontWeight:600 }}>{u.name}</div>
                <div style={{ color:"rgba(255,255,255,0.4)", fontSize:11 }}>{u.email}</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <span style={{
                  ...S.tag,
                  background: u.is_active ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)",
                  color: u.is_active ? "#22c55e" : "#ef4444",
                }}>
                  {u.is_active ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          )) : <p style={{ color:"rgba(255,255,255,0.3)", fontSize:13 }}>No users yet</p>}
        </div>

        {/* Activity Last 7 Days */}
        <div style={S.card}>
          <div style={{ ...S.label, marginBottom:16 }}>Tracker Activity — Last 7 Days</div>
          {stats.activityLast7?.length ? stats.activityLast7.map(a => {
            const maxCal = Math.max(...stats.activityLast7.map(x => x.total_cal || 0), 1);
            const pct = Math.min(((a.total_cal || 0) / maxCal) * 100, 100);
            return (
              <div key={a.date} style={{ marginBottom:12 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                  <span style={{ color:"rgba(255,255,255,0.6)", fontSize:12 }}>
                    {new Date(a.date).toLocaleDateString("en", { weekday:"short", month:"short", day:"numeric" })}
                  </span>
                  <span style={{ color:"rgba(255,255,255,0.7)", fontSize:12 }}>
                    {a.entries} logs · {a.total_cal || 0} kcal
                  </span>
                </div>
                <div style={{ height:6, background:"rgba(255,255,255,0.08)", borderRadius:3 }}>
                  <div style={{ width:`${pct}%`, height:"100%", background:"linear-gradient(90deg,#e94560,#c62a47)", borderRadius:3, transition:"width 0.5s" }} />
                </div>
              </div>
            );
          }) : <p style={{ color:"rgba(255,255,255,0.3)", fontSize:13 }}>No tracker activity yet</p>}
        </div>
      </div>
    </div>
  );
}
