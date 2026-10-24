import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Eye, ChevronLeft, ChevronRight } from "lucide-react";

export default function AdminTrackers() {
  const [data, setData] = useState({ records:[], total:0, pages:1 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axios.get(`/api/admin/trackers?page=${page}&limit=30`)
      .then(r => setData(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page]);

  const S = {
    tag: { display:"inline-block", padding:"2px 8px", borderRadius:20, fontSize:11, fontWeight:600 },
  };

  return (
    <div className="fade-in">
      <div style={{ color:"white", fontSize:26, fontWeight:700, marginBottom:4, fontFamily:"Playfair Display,serif" }}>📋 Tracker Records</div>
      <p style={{ color:"rgba(255,255,255,0.4)", fontSize:14, marginBottom:24 }}>All meal tracking logs — {data.total} total</p>

      <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:16, overflow:"hidden" }}>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
            <thead>
              <tr style={{ borderBottom:"1px solid rgba(255,255,255,0.08)" }}>
                {["User","Email","Date","Breakfast","Lunch","Dinner","Snack","Calories","Water","Action"].map(h => (
                  <th key={h} style={{ padding:"13px 14px", textAlign:"left", color:"rgba(255,255,255,0.4)", fontWeight:600, fontSize:10, textTransform:"uppercase", letterSpacing:0.8, whiteSpace:"nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={10} style={{ padding:40, textAlign:"center", color:"rgba(255,255,255,0.3)" }}>Loading...</td></tr>
              ) : data.records.map(r => (
                <tr key={r.id} style={{ borderBottom:"1px solid rgba(255,255,255,0.04)" }}
                  onMouseEnter={e => e.currentTarget.style.background="rgba(255,255,255,0.03)"}
                  onMouseLeave={e => e.currentTarget.style.background="transparent"}
                >
                  <td style={{ padding:"11px 14px", color:"white", fontWeight:500 }}>{r.user_name}</td>
                  <td style={{ padding:"11px 14px", color:"rgba(255,255,255,0.45)" }}>{r.user_email}</td>
                  <td style={{ padding:"11px 14px", color:"rgba(255,255,255,0.7)", fontWeight:600, whiteSpace:"nowrap" }}>{r.date}</td>
                  {[
                    [r.breakfast_name, r.breakfast_done],
                    [r.lunch_name,     r.lunch_done],
                    [r.dinner_name,    r.dinner_done],
                    [r.snack_name,     r.snack_done],
                  ].map(([name, done], i) => (
                    <td key={i} style={{ padding:"11px 14px", maxWidth:120 }}>
                      {name ? (
                        <span style={{ ...S.tag, background: done ? "rgba(34,197,94,0.12)" : "rgba(255,255,255,0.06)", color: done ? "#22c55e" : "rgba(255,255,255,0.5)" }}>
                          {done ? "✓ " : ""}{name.length > 18 ? name.slice(0,17)+"…" : name}
                        </span>
                      ) : <span style={{ color:"rgba(255,255,255,0.2)" }}>—</span>}
                    </td>
                  ))}
                  <td style={{ padding:"11px 14px", color:"#f59e0b", fontWeight:600 }}>{r.total_calories} kcal</td>
                  <td style={{ padding:"11px 14px", color:"#06b6d4" }}>{r.water_intake} 💧</td>
                  <td style={{ padding:"11px 14px" }}>
                    <button onClick={() => navigate(`/admin/users/${r.user_id}`)}
                      style={{ width:28, height:28, borderRadius:7, border:"1px solid rgba(99,102,241,0.3)", background:"rgba(99,102,241,0.1)", color:"#818cf8", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <Eye size={13}/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {data.pages > 1 && (
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"13px 18px", borderTop:"1px solid rgba(255,255,255,0.06)" }}>
            <span style={{ color:"rgba(255,255,255,0.35)", fontSize:12 }}>Page {page} of {data.pages}</span>
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={() => setPage(p=>Math.max(1,p-1))} disabled={page===1}
                style={{ padding:"5px 12px", borderRadius:7, border:"1px solid rgba(255,255,255,0.1)", background:"transparent", color:"rgba(255,255,255,0.5)", cursor:"pointer", fontSize:12, display:"flex", alignItems:"center", gap:3, opacity:page===1?0.4:1 }}>
                <ChevronLeft size={13}/> Prev
              </button>
              <button onClick={() => setPage(p=>Math.min(data.pages,p+1))} disabled={page===data.pages}
                style={{ padding:"5px 12px", borderRadius:7, border:"1px solid rgba(255,255,255,0.1)", background:"transparent", color:"rgba(255,255,255,0.5)", cursor:"pointer", fontSize:12, display:"flex", alignItems:"center", gap:3, opacity:page===data.pages?0.4:1 }}>
                Next <ChevronRight size={13}/>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
