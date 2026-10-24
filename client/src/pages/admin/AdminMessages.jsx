import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Mail, Trash2, CheckCheck } from "lucide-react";

export default function AdminMessages() {
  const [msgs, setMsgs] = useState([]);
  const load = () => axios.get("/api/admin/messages").then(r => setMsgs(r.data.messages)).catch(console.error);
  useEffect(() => { load(); }, []);
  const ping = () => window.dispatchEvent(new Event("kdp-messages-changed"));
  const read = async (m) => { await axios.patch(`/api/admin/messages/${m.id}/read`); load(); ping(); };
  const del = async (m) => { if (!confirm("Delete this message?")) return; await axios.delete(`/api/admin/messages/${m.id}`); toast.success("Deleted"); load(); ping(); };

  return (
    <div className="fade-in">
      <div style={{ color: "#fff", fontSize: 26, fontWeight: 700, marginBottom: 4 }}>✉️ Messages</div>
      <p style={{ color: "rgba(255,255,255,.4)", fontSize: 14, marginBottom: 24 }}>Messages sent from the website contact form</p>
      {msgs.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60, color: "rgba(255,255,255,.35)" }}><Mail size={42} style={{ marginBottom: 12 }} /><div>No messages yet</div></div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {msgs.map(m => (
            <div key={m.id} style={{ background: m.is_read ? "rgba(255,255,255,.03)" : "rgba(233,69,96,.07)", border: `1px solid ${m.is_read ? "rgba(255,255,255,.08)" : "rgba(233,69,96,.3)"}`, borderRadius: 14, padding: "16px 20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 6 }}>
                <div><span style={{ color: "#fff", fontWeight: 700 }}>{m.name}</span> <a href={`mailto:${m.email}`} style={{ color: "#818cf8", fontSize: 13 }}>{m.email}</a>{!m.is_read && <span style={{ marginLeft: 10, background: "#e94560", color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 8 }}>NEW</span>}</div>
                <span style={{ color: "rgba(255,255,255,.35)", fontSize: 12 }}>{m.created_at}</span>
              </div>
              {m.subject && <div style={{ color: "#fff", fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{m.subject}</div>}
              <p style={{ color: "rgba(255,255,255,.7)", fontSize: 14, whiteSpace: "pre-wrap" }}>{m.message}</p>
              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                {!m.is_read && <button onClick={() => read(m)} style={{ background: "rgba(34,197,94,.12)", border: "1px solid rgba(34,197,94,.3)", color: "#4ade80", borderRadius: 8, padding: "5px 12px", fontSize: 12, cursor: "pointer", display: "flex", gap: 5, alignItems: "center" }}><CheckCheck size={13} /> Mark read</button>}
                <button onClick={() => del(m)} style={{ background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.3)", color: "#f87171", borderRadius: 8, padding: "5px 12px", fontSize: 12, cursor: "pointer", display: "flex", gap: 5, alignItems: "center" }}><Trash2 size={13} /> Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
