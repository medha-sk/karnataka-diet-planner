// scripts/show-db.js — print the database in the terminal (handy to show an evaluator)
// Run:  npm run db:show            → all tables
//       npm run db:show users      → one table
const fs = require("fs"), path = require("path");
const initSqlJs = require("sql.js");
const file = path.join(__dirname, "..", "data", "kdp.db");
(async () => {
  if (!fs.existsSync(file)) return console.log("No database yet — start the server once (npm start).");
  const SQL = await initSqlJs();
  const db = new SQL.Database(fs.readFileSync(file));
  const only = process.argv[2];
  const tables = db.exec("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name")[0].values.flat();
  for (const t of tables) {
    if (only && only !== t) continue;
    const count = db.exec(`SELECT COUNT(*) FROM ${t}`)[0].values[0][0];
    console.log(`\n━━━ ${t}  (${count} rows) ━━━`);
    const cols = db.exec(`PRAGMA table_info(${t})`)[0].values.map(c => `${c[1]} ${c[2]}`);
    console.log("Columns:", cols.join(", "));
    const hide = t === "users" ? "id,name,email,role,goal,diet_type,medical_conditions,bmi,is_active,created_at" : "*";
    const r = db.exec(`SELECT ${hide} FROM ${t} ORDER BY rowid LIMIT 15`)[0];
    if (r) console.table(r.values.map(v => Object.fromEntries(r.columns.map((c, i) => [c, typeof v[i] === "string" && v[i].length > 28 ? v[i].slice(0, 26) + "…" : v[i]]))));
  }
})();
