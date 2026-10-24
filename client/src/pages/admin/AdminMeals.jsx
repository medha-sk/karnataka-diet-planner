import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Plus, Trash2, Pencil, X, Search } from "lucide-react";

const EMPTY = { name: "", name_kn: "", description: "", description_kn: "", calories: "", tags: "", diet_type: "vegetarian", goal: "maintain", meal_type: "breakfast" };
const inp = { width: "100%", background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.15)", borderRadius: 9, padding: "9px 12px", color: "#fff", fontSize: 13.5, outline: "none", fontFamily: "inherit" };
const lbl = { display: "block", fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,.5)", marginBottom: 5, textTransform: "uppercase", letterSpacing: .6 };

export default function AdminMeals() {
  const [meals, setMeals] = useState([]);
  const [f, setF] = useState({ q: "", diet: "", goal: "", type: "" });
  const [edit, setEdit] = useState(null);

  const load = () => axios.get("/api/admin/meals", { params: f }).then(r => setMeals(r.data)).catch(console.error);
  useEffect(() => { const id = setTimeout(load, 200); return () => clearTimeout(id); }, [f]);

  const save = async (e) => {
    e.preventDefault();
    try {
      if (edit.id) await axios.put(`/api/admin/meals/${edit.id}`, edit); else await axios.post("/api/admin/meals", edit);
      toast.success(edit.id ? "Meal updated" : "Meal added"); setEdit(null); load();
    } catch (err) { toast.error(err.response?.data?.message || "Error"); }
  };
  const del = async (m) => { if (!confirm(`Delete "${m.name}"?`)) return; await axios.delete(`/api/admin/meals/${m.id}`); toast.success("Deleted"); load(); };
  const up = (k) => (e) => setEdit({ ...edit, [k]: e.target.value });

  return (
    <div className="fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22, gap: 12, flexWrap: "wrap" }}>
        <div><div style={{ color: "#fff", fontSize: 26, fontWeight: 700, marginBottom: 4 }}>🍛 Food Catalogue</div>
          <p style={{ color: "rgba(255,255,255,.4)", fontSize: 14 }}>{meals.length} dishes — changes appear instantly on the website and in user plans</p></div>
        <button onClick={() => setEdit({ ...EMPTY })} style={{ background: "linear-gradient(135deg,#e94560,#c62a47)", color: "#fff", border: "none", borderRadius: 10, padding: "10px 18px", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}><Plus size={16} /> Add dish</button>
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 18 }}>
        <div style={{ position: "relative", flex: 2, minWidth: 200 }}><Search size={15} style={{ position: "absolute", left: 11, top: 11, color: "rgba(255,255,255,.4)" }} />
          <input style={{ ...inp, paddingLeft: 34 }} placeholder="Search dishes…" value={f.q} onChange={e => setF({ ...f, q: e.target.value })} /></div>
        {[["diet", ["vegetarian", "non-vegetarian"]], ["goal", ["lose", "maintain", "gain"]], ["type", ["breakfast", "lunch", "dinner", "snack"]]].map(([k, opts]) => (
          <select key={k} style={{ ...inp, flex: 1, minWidth: 130 }} value={f[k]} onChange={e => setF({ ...f, [k]: e.target.value })}>
            <option value="">All {k}s</option>{opts.map(o => <option key={o} value={o}>{o}</option>)}</select>))}
      </div>

      <div style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 14, overflow: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead><tr style={{ background: "rgba(255,255,255,.04)" }}>{["Dish", "ಕನ್ನಡ", "Diet", "Goal", "Meal", "kcal", ""].map(h => <th key={h} style={{ padding: "11px 14px", textAlign: "left", color: "rgba(255,255,255,.5)", fontSize: 11, textTransform: "uppercase", letterSpacing: .6 }}>{h}</th>)}</tr></thead>
          <tbody>{meals.map(m => (
            <tr key={m.id} style={{ borderTop: "1px solid rgba(255,255,255,.05)" }}>
              <td style={{ padding: "10px 14px", color: "#fff", fontWeight: 600 }}>{m.name}</td>
              <td style={{ padding: "10px 14px", color: "rgba(255,255,255,.65)" }}>{m.name_kn || <i style={{ opacity: .4 }}>—</i>}</td>
              <td style={{ padding: "10px 14px", color: m.diet_type === "vegetarian" ? "#4ade80" : "#fb923c" }}>{m.diet_type}</td>
              <td style={{ padding: "10px 14px", color: "rgba(255,255,255,.65)" }}>{m.goal}</td>
              <td style={{ padding: "10px 14px", color: "rgba(255,255,255,.65)" }}>{m.meal_type}</td>
              <td style={{ padding: "10px 14px", color: "#f59e0b", fontWeight: 700 }}>{m.calories}</td>
              <td style={{ padding: "10px 14px", whiteSpace: "nowrap" }}>
                <button onClick={() => setEdit(m)} aria-label="Edit" style={{ background: "none", border: "none", color: "#818cf8", cursor: "pointer", marginRight: 8 }}><Pencil size={15} /></button>
                <button onClick={() => del(m)} aria-label="Delete" style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer" }}><Trash2 size={15} /></button></td>
            </tr>))}</tbody>
        </table>
      </div>

      {edit && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.65)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={() => setEdit(null)}>
          <form onSubmit={save} onClick={e => e.stopPropagation()} style={{ background: "#1a1a2e", border: "1px solid rgba(255,255,255,.12)", borderRadius: 18, padding: 28, width: "100%", maxWidth: 600, maxHeight: "92vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}><div style={{ color: "#fff", fontSize: 20, fontWeight: 700 }}>{edit.id ? "Edit dish" : "Add dish"}</div>
              <button type="button" onClick={() => setEdit(null)} aria-label="Close" style={{ background: "none", border: "none", color: "#fff", cursor: "pointer" }}><X size={20} /></button></div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div><label style={lbl}>Name (English) *</label><input style={inp} value={edit.name} onChange={up("name")} required /></div>
              <div><label style={lbl}>Name (ಕನ್ನಡ)</label><input style={inp} value={edit.name_kn || ""} onChange={up("name_kn")} /></div>
              <div style={{ gridColumn: "1/-1" }}><label style={lbl}>Description (English)</label><input style={inp} value={edit.description || ""} onChange={up("description")} /></div>
              <div style={{ gridColumn: "1/-1" }}><label style={lbl}>Description (ಕನ್ನಡ)</label><input style={inp} value={edit.description_kn || ""} onChange={up("description_kn")} /></div>
              <div><label style={lbl}>Diet</label><select style={inp} value={edit.diet_type} onChange={up("diet_type")}><option>vegetarian</option><option>non-vegetarian</option></select></div>
              <div><label style={lbl}>Goal</label><select style={inp} value={edit.goal} onChange={up("goal")}><option>lose</option><option>maintain</option><option>gain</option></select></div>
              <div><label style={lbl}>Meal type</label><select style={inp} value={edit.meal_type} onChange={up("meal_type")}><option>breakfast</option><option>lunch</option><option>dinner</option><option>snack</option></select></div>
              <div><label style={lbl}>Calories *</label><input type="number" min="1" style={inp} value={edit.calories} onChange={up("calories")} required /></div>
              <div style={{ gridColumn: "1/-1" }}><label style={lbl}>Tags (comma separated)</label><input style={inp} value={edit.tags || ""} onChange={up("tags")} placeholder="ragi,iron rich" /></div>
            </div>
            <button style={{ marginTop: 20, width: "100%", background: "linear-gradient(135deg,#e94560,#c62a47)", color: "#fff", border: "none", borderRadius: 10, padding: 13, fontWeight: 700, cursor: "pointer" }}>{edit.id ? "Save changes" : "Add dish"}</button>
          </form>
        </div>
      )}
    </div>
  );
}
