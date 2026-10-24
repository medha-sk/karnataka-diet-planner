import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Search, Eye, Trash2, ToggleLeft, ToggleRight, ChevronLeft, ChevronRight } from "lucide-react";

const S = {
  title: { color:"white", fontSize:26, fontWeight:700, marginBottom:4, fontFamily:"Playfair Display,serif" },
  sub:   { color:"rgba(255,255,255,0.4)", fontSize:14, marginBottom:28 },
  tag:   { display:"inline-block", padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:600 },
};

export default function AdminUsers() {
  const [data, setData] = useState({ users:[], total:0, pages:1 });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUsers = (s = search, p = page) => {
    setLoading(true);
    axios.get(`/api/admin/users?search=${s}&page=${p}&limit=20`)
      .then(r => setData(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchUsers(search, 1);
  };

  const toggleUser = async (id) => {
    try {
      const r = await axios.patch(`/api/admin/users/${id}/toggle`);
      toast.success(r.data.is_active ? "User activated" : "User deactivated");
      fetchUsers();
    } catch { toast.error("Failed"); }
  };

  const deleteUser = async (id, name) => {
    if (!confirm(`Delete user "${name}"? This will also delete all their tracker records.`)) return;
    try {
      await axios.delete(`/api/admin/users/${id}`);
      toast.success("User deleted");
      fetchUsers();
    } catch { toast.error("Failed to delete"); }
  };

  const goalLabel = (g) => ({ lose:"⬇ Loss", maintain:"⚖ Maintain", gain:"⬆ Gain" }[g] || g);
  const bmiColor  = (bt) => ({ underweight:"#06b6d4", normal:"#22c55e", overweight:"#f59e0b" }[bt] || "#888");

  return (
    <div className="fade-in">
      <div style={S.title}>👥 Users</div>
      <p style={S.sub}>Manage all registered users — {data.total} total</p>

      {/* Search */}
      <form onSubmit={handleSearch} style={{ display:"flex", gap:10, marginBottom:20 }}>
        <div style={{ flex:1, position:"relative" }}>
          <Search size={15} style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:"rgba(255,255,255,0.3)" }} />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or email…"
            style={{
              width:"100%", padding:"10px 10px 10px 36px",
              background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)",
              borderRadius:10, color:"white", fontSize:14, outline:"none",
              fontFamily:"Plus Jakarta Sans,sans-serif",
            }}
          />
        </div>
        <button type="submit" style={{
          padding:"10px 20px", background:"linear-gradient(135deg,#e94560,#c62a47)",
          border:"none", borderRadius:10, color:"white", fontWeight:600,
          fontSize:14, cursor:"pointer", fontFamily:"Plus Jakarta Sans,sans-serif",
        }}>Search</button>
      </form>

      {/* Table */}
      <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:16, overflow:"hidden" }}>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
            <thead>
              <tr style={{ borderBottom:"1px solid rgba(255,255,255,0.08)" }}>
                {["#","Name","Email","Goal","Diet","BMI","Status","Logs","Joined","Actions"].map(h => (
                  <th key={h} style={{ padding:"14px 16px", textAlign:"left", color:"rgba(255,255,255,0.4)", fontWeight:600, fontSize:11, textTransform:"uppercase", letterSpacing:0.8, whiteSpace:"nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={10} style={{ padding:40, textAlign:"center", color:"rgba(255,255,255,0.3)" }}>Loading...</td></tr>
              ) : data.users.length === 0 ? (
                <tr><td colSpan={10} style={{ padding:40, textAlign:"center", color:"rgba(255,255,255,0.3)" }}>No users found</td></tr>
              ) : data.users.map((u, i) => (
                <tr key={u.id} style={{ borderBottom:"1px solid rgba(255,255,255,0.04)", transition:"background 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <td style={{ padding:"12px 16px", color:"rgba(255,255,255,0.3)" }}>{(page-1)*20+i+1}</td>
                  <td style={{ padding:"12px 16px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:9 }}>
                      <div style={{
                        width:30, height:30, borderRadius:"50%",
                        background:"linear-gradient(135deg,#6366f1,#8b5cf6)",
                        display:"flex", alignItems:"center", justifyContent:"center",
                        color:"white", fontWeight:700, fontSize:12, flexShrink:0,
                      }}>{u.name[0].toUpperCase()}</div>
                      <span style={{ color:"white", fontWeight:500 }}>{u.name}</span>
                    </div>
                  </td>
                  <td style={{ padding:"12px 16px", color:"rgba(255,255,255,0.6)" }}>{u.email}</td>
                  <td style={{ padding:"12px 16px" }}>
                    <span style={{ ...S.tag, background:"rgba(99,102,241,0.15)", color:"#818cf8" }}>{goalLabel(u.goal)}</span>
                  </td>
                  <td style={{ padding:"12px 16px", color:"rgba(255,255,255,0.6)", textTransform:"capitalize" }}>
                    {u.diet_type === "vegetarian" ? "🥦" : "🍗"} {u.diet_type?.replace("-"," ")}
                  </td>
                  <td style={{ padding:"12px 16px" }}>
                    {u.bmi ? (
                      <span style={{ ...S.tag, background:`${bmiColor(u.body_type)}22`, color:bmiColor(u.body_type) }}>
                        {u.bmi} · {u.body_type}
                      </span>
                    ) : <span style={{ color:"rgba(255,255,255,0.2)" }}>—</span>}
                  </td>
                  <td style={{ padding:"12px 16px" }}>
                    <span style={{ ...S.tag, background: u.is_active ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)", color: u.is_active ? "#22c55e" : "#ef4444" }}>
                      {u.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td style={{ padding:"12px 16px", color:"rgba(255,255,255,0.5)" }}>{u.tracker_count || 0}</td>
                  <td style={{ padding:"12px 16px", color:"rgba(255,255,255,0.4)", whiteSpace:"nowrap" }}>
                    {new Date(u.created_at).toLocaleDateString("en", { month:"short", day:"numeric", year:"2-digit" })}
                  </td>
                  <td style={{ padding:"12px 16px" }}>
                    <div style={{ display:"flex", gap:6 }}>
                      <button onClick={() => navigate(`/admin/users/${u.id}`)} title="View"
                        style={{ width:30, height:30, borderRadius:8, border:"1px solid rgba(99,102,241,0.3)", background:"rgba(99,102,241,0.1)", color:"#818cf8", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                        <Eye size={14} />
                      </button>
                      <button onClick={() => toggleUser(u.id)} title={u.is_active ? "Deactivate" : "Activate"}
                        style={{ width:30, height:30, borderRadius:8, border:`1px solid ${u.is_active ? "rgba(245,158,11,0.3)" : "rgba(34,197,94,0.3)"}`, background: u.is_active ? "rgba(245,158,11,0.1)" : "rgba(34,197,94,0.1)", color: u.is_active ? "#f59e0b" : "#22c55e", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                        {u.is_active ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                      </button>
                      <button onClick={() => deleteUser(u.id, u.name)} title="Delete"
                        style={{ width:30, height:30, borderRadius:8, border:"1px solid rgba(239,68,68,0.3)", background:"rgba(239,68,68,0.1)", color:"#ef4444", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data.pages > 1 && (
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 20px", borderTop:"1px solid rgba(255,255,255,0.06)" }}>
            <span style={{ color:"rgba(255,255,255,0.4)", fontSize:13 }}>Page {page} of {data.pages} · {data.total} users</span>
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1}
                style={{ padding:"6px 12px", borderRadius:8, border:"1px solid rgba(255,255,255,0.1)", background:"transparent", color:"rgba(255,255,255,0.5)", cursor:"pointer", display:"flex", alignItems:"center", gap:4, fontSize:13, opacity:page===1?0.4:1 }}>
                <ChevronLeft size={14}/> Prev
              </button>
              <button onClick={() => setPage(p => Math.min(data.pages,p+1))} disabled={page===data.pages}
                style={{ padding:"6px 12px", borderRadius:8, border:"1px solid rgba(255,255,255,0.1)", background:"transparent", color:"rgba(255,255,255,0.5)", cursor:"pointer", display:"flex", alignItems:"center", gap:4, fontSize:13, opacity:page===data.pages?0.4:1 }}>
                Next <ChevronRight size={14}/>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
