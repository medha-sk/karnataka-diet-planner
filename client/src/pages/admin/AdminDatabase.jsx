import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Database, ChevronLeft, ChevronRight, RefreshCw, Download, Play, Table2, Terminal } from "lucide-react";

const dim = "rgba(255,255,255,0.4)";
const PRESETS = [
  ["All users", "SELECT id, name, email, role, goal, diet_type, medical_conditions, bmi FROM users"],
  ["Users + tracker counts", "SELECT u.name, u.email, COUNT(t.id) AS days_logged, ROUND(AVG(t.total_calories)) AS avg_kcal\nFROM users u LEFT JOIN trackers t ON t.user_id = u.id\nWHERE u.role = 'user' GROUP BY u.id ORDER BY days_logged DESC"],
  ["Meals per diet & goal", "SELECT diet_type, goal, COUNT(*) AS dishes, ROUND(AVG(calories)) AS avg_kcal FROM meals GROUP BY diet_type, goal"],
  ["Diabetes-safe lunches", "SELECT name, name_kn, calories FROM meals\nWHERE meal_type = 'lunch' AND diet_type = 'vegetarian'\nAND name NOT IN ('Rava Kesari Bath','Puri with Saagu','Groundnut Chikki','Banana Chips with Jaggery','Mango Lassi')"],
  ["Table structure (users)", "PRAGMA table_info(users)"],
];

function Cell({ col, val }) {
  const isNull = val === null || val === undefined;
  let text = isNull ? "NULL" : String(val);
  const isBool = /(_done|is_active|is_read)$/.test(col);
  if (!isNull && text.length > 38) text = text.slice(0, 36) + "…";
  const isHash = col === "password";
  const color = isNull ? "rgba(255,255,255,0.2)" : isHash ? "#f472b6" : isBool ? (val ? "#22c55e" : "#ef4444")
    : typeof val === "number" ? "#f59e0b" : col === "role" ? (val === "admin" ? "#e94560" : "#818cf8") : "rgba(255,255,255,0.78)";
  return <td style={{ padding: "9px 12px", whiteSpace: "nowrap" }} title={isNull ? "" : String(val)}>
    <div style={{ maxWidth: isHash ? 140 : 230, overflow: "hidden", textOverflow: "ellipsis", color, fontStyle: isNull ? "italic" : "normal", fontWeight: col === "id" || col === "email" ? 600 : 400, fontFamily: isHash ? "monospace" : "inherit" }}>
      {isBool && !isNull ? (val ? "✓ true" : "✗ false") : text}</div></td>;
}

function DataTable({ columns, rows }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
        <thead><tr style={{ background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          {columns.map(c => <th key={c} style={{ padding: "10px 12px", textAlign: "left", color: "rgba(255,255,255,0.5)", fontSize: 10.5, textTransform: "uppercase", letterSpacing: .6, whiteSpace: "nowrap" }}>{c}</th>)}</tr></thead>
        <tbody>{rows.map((r, i) => (
          <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }} onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
            {columns.map(c => <Cell key={c} col={c} val={r[c]} />)}</tr>))}</tbody>
      </table>
    </div>
  );
}

export default function AdminDatabase() {
  const [meta, setMeta] = useState({ tables: {}, file: "", engine: "" });
  const [active, setActive] = useState("users");
  const [data, setData] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("browse");          // browse | sql
  const [sql, setSql] = useState(PRESETS[1][1]);
  const [result, setResult] = useState(null);
  const [sqlErr, setSqlErr] = useState("");

  const loadMeta = () => axios.get("/api/admin/db/tables").then(r => setMeta(r.data)).catch(console.error);
  const loadTable = (name = active, p = page) => {
    setLoading(true);
    axios.get(`/api/admin/db/table/${name}?page=${p}&limit=25`).then(r => setData(r.data)).catch(console.error).finally(() => setLoading(false));
  };
  useEffect(() => { loadMeta(); }, []);
  useEffect(() => { if (mode === "browse") loadTable(active, page); }, [active, page, mode]);

  const run = async () => {
    setSqlErr(""); setResult(null);
    try { const { data } = await axios.post("/api/admin/db/query", { sql }); setResult(data); }
    catch (e) { setSqlErr(e.response?.data?.message || "Query failed"); }
  };
  const download = async () => {
    try {
      const r = await axios.get("/api/admin/db/download", { responseType: "blob" });
      const a = document.createElement("a"); a.href = URL.createObjectURL(r.data); a.download = "kdp.db"; a.click();
      toast.success("kdp.db downloaded — open it with DB Browser for SQLite");
    } catch { toast.error("Download failed"); }
  };

  const tables = Object.entries(meta.tables);
  const totalRows = tables.reduce((s, [, i]) => s + i.rowCount, 0);
  const box = { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14 };
  const typeColor = (t = "") => t.includes("INT") ? "#06b6d4" : t.includes("TEXT") ? "#22c55e" : t.includes("REAL") ? "#f59e0b" : "#a78bfa";
  const btn = (on) => ({ padding: "8px 16px", borderRadius: 9, border: `1px solid ${on ? "rgba(233,69,96,.5)" : "rgba(255,255,255,.12)"}`, background: on ? "rgba(233,69,96,.15)" : "rgba(255,255,255,.04)", color: on ? "#e94560" : "rgba(255,255,255,.65)", cursor: "pointer", fontSize: 13, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 6 });

  return (
    <div className="fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ color: "#fff", fontSize: 26, fontWeight: 700, marginBottom: 4 }}>🗄️ Database Viewer</div>
          <p style={{ color: dim, fontSize: 14 }}>Live data straight from the SQLite database</p>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button style={btn(false)} onClick={() => { loadMeta(); mode === "browse" && loadTable(); }}><RefreshCw size={14} /> Refresh</button>
          <button style={btn(false)} onClick={download}><Download size={14} /> Download kdp.db</button>
        </div>
      </div>

      <div style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)", borderRadius: 12, padding: "14px 20px", marginBottom: 20, display: "flex", gap: 22, flexWrap: "wrap", alignItems: "center" }}>
        <Database size={18} color="#818cf8" />
        <span style={{ color: "#a5b4fc", fontWeight: 700, fontSize: 13 }}>{meta.engine || "SQLite"}</span>
        <span style={{ color: dim, fontSize: 13 }}>File: <code style={{ color: "#c7d2fe" }}>{meta.file}</code></span>
        <span style={{ color: dim, fontSize: 13 }}>{tables.length} tables · {totalRows} rows total</span>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
        <button style={btn(mode === "browse")} onClick={() => setMode("browse")}><Table2 size={14} /> Browse tables</button>
        <button style={btn(mode === "sql")} onClick={() => setMode("sql")}><Terminal size={14} /> SQL console</button>
      </div>

      {mode === "browse" && (
        <div style={{ display: "grid", gridTemplateColumns: "230px 1fr", gap: 20, alignItems: "start" }}>
          <div>
            <div style={{ color: dim, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: .8, marginBottom: 10 }}>Tables</div>
            {tables.map(([name, info]) => (
              <button key={name} onClick={() => { setActive(name); setPage(1); }} style={{ width: "100%", padding: "11px 14px", borderRadius: 10, marginBottom: 6, textAlign: "left", cursor: "pointer", border: `1px solid ${active === name ? "rgba(233,69,96,.4)" : "rgba(255,255,255,.08)"}`, background: active === name ? "rgba(233,69,96,.12)" : "rgba(255,255,255,.03)" }}>
                <div style={{ color: active === name ? "#e94560" : "#fff", fontWeight: 600, fontSize: 13 }}>{name}</div>
                <div style={{ color: "rgba(255,255,255,.35)", fontSize: 11, marginTop: 2 }}>{info.rowCount} rows · {info.columns.length} cols</div>
              </button>
            ))}
            {meta.tables[active] && (
              <div style={{ ...box, padding: 16, marginTop: 14 }}>
                <div style={{ color: "rgba(255,255,255,.5)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: .8, marginBottom: 12 }}>Schema · {active}</div>
                {meta.tables[active].columns.map(c => (
                  <div key={c.name} style={{ display: "flex", justifyContent: "space-between", marginBottom: 7, alignItems: "center", gap: 8 }}>
                    <span style={{ color: "#fff", fontSize: 12 }}>{c.name}{c.pk ? " 🔑" : ""}</span>
                    <span style={{ color: typeColor(c.type), fontSize: 10, fontWeight: 700, background: `${typeColor(c.type)}22`, padding: "2px 7px", borderRadius: 4 }}>{c.type || "TEXT"}{c.notnull ? " NN" : ""}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div style={{ ...box, overflow: "hidden", minWidth: 0 }}>
            <div style={{ padding: "14px 18px", borderBottom: "1px solid rgba(255,255,255,.06)", display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>{active} <span style={{ color: "rgba(255,255,255,.35)", fontWeight: 400 }}>({data?.total ?? 0} rows)</span></span>
              <span style={{ color: "rgba(255,255,255,.35)", fontSize: 12 }}>Page {page} of {data?.pages || 1}</span>
            </div>
            {loading ? <div style={{ color: "rgba(255,255,255,.3)", padding: 40, textAlign: "center" }}>Loading…</div> : data && <DataTable columns={data.columns} rows={data.rows} />}
            {data?.pages > 1 && (
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, padding: "12px 16px", borderTop: "1px solid rgba(255,255,255,.06)" }}>
                <button style={{ ...btn(false), opacity: page === 1 ? .4 : 1 }} disabled={page === 1} onClick={() => setPage(p => p - 1)}><ChevronLeft size={12} /> Prev</button>
                <button style={{ ...btn(false), opacity: page === data.pages ? .4 : 1 }} disabled={page === data.pages} onClick={() => setPage(p => p + 1)}>Next <ChevronRight size={12} /></button>
              </div>
            )}
          </div>
        </div>
      )}

      {mode === "sql" && (
        <div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
            {PRESETS.map(([label, q]) => <button key={label} style={btn(false)} onClick={() => setSql(q)}>{label}</button>)}
          </div>
          <textarea value={sql} onChange={e => setSql(e.target.value)} spellCheck={false} rows={6}
            onKeyDown={e => (e.ctrlKey || e.metaKey) && e.key === "Enter" && run()}
            style={{ width: "100%", background: "#0b0b14", color: "#a5f3fc", border: "1px solid rgba(255,255,255,.12)", borderRadius: 12, padding: 16, fontFamily: "ui-monospace,Consolas,monospace", fontSize: 13.5, outline: "none", resize: "vertical" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "12px 0 18px" }}>
            <button onClick={run} style={{ ...btn(true), padding: "10px 22px" }}><Play size={14} /> Run query</button>
            <span style={{ color: dim, fontSize: 12 }}>Ctrl + Enter · read-only (SELECT only)</span>
          </div>
          {sqlErr && <div style={{ background: "rgba(239,68,68,.12)", border: "1px solid rgba(239,68,68,.35)", color: "#fca5a5", padding: "12px 16px", borderRadius: 10, fontSize: 13 }}>{sqlErr}</div>}
          {result && (
            <div style={{ ...box, overflow: "hidden" }}>
              <div style={{ padding: "12px 18px", borderBottom: "1px solid rgba(255,255,255,.06)", color: "#86efac", fontSize: 13 }}>✓ {result.count} row(s) · {result.ms} ms</div>
              {result.rows.length ? <DataTable columns={result.columns} rows={result.rows} /> : <div style={{ padding: 24, color: dim }}>No rows returned</div>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
