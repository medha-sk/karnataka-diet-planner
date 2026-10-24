// routes/admin.js — Admin Portal API
const express          = require("express");
const router           = express.Router();
const bcrypt           = require("bcryptjs");
const jwt              = require("jsonwebtoken");
const { prepare, localDate, DB_PATH } = require("../config/db");
const { adminProtect } = require("../middleware/auth");

const genAdminToken = (id) =>
  jwt.sign({ id }, process.env.JWT_ADMIN_SECRET || process.env.JWT_SECRET, { expiresIn: "7d" });

// ── Admin Login ───────────────────────────────────────────────────────────────
router.post("/login", (req, res) => {
  try {
    const { email, password } = req.body;
    const user = prepare("SELECT * FROM users WHERE email = ? AND role = 'admin'").get(email?.toLowerCase());
    if (!user || !bcrypt.compareSync(password, user.password))
      return res.status(401).json({ message: "Invalid admin credentials" });
    prepare("UPDATE users SET last_login = datetime('now') WHERE id = ?").run(user.id);
    delete user.password;
    res.json({ ...user, token: genAdminToken(user.id) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── Dashboard Stats ───────────────────────────────────────────────────────────
router.get("/stats", adminProtect, (req, res) => {
  const totalUsers    = prepare("SELECT COUNT(*) as c FROM users WHERE role='user'").get().c;
  const activeUsers   = prepare("SELECT COUNT(*) as c FROM users WHERE role='user' AND is_active=1").get().c;
  const totalTrackers = prepare("SELECT COUNT(*) as c FROM trackers").get().c;
  const todayTrackers = prepare("SELECT COUNT(*) as c FROM trackers WHERE date=?").get(localDate()).c;
  const newUsersToday = prepare("SELECT COUNT(*) as c FROM users WHERE DATE(created_at)=date('now') AND role='user'").get().c;
  const newUsersWeek  = prepare("SELECT COUNT(*) as c FROM users WHERE created_at >= datetime('now','-7 days') AND role='user'").get().c;
  const avgRow        = prepare("SELECT AVG(total_calories) as a FROM trackers WHERE total_calories > 0").get();
  const goalBreakdown = prepare("SELECT goal, COUNT(*) as count FROM users WHERE role='user' GROUP BY goal").all();
  const dietBreakdown = prepare("SELECT diet_type, COUNT(*) as count FROM users WHERE role='user' GROUP BY diet_type").all();
  const bodyBreakdown = prepare("SELECT body_type, COUNT(*) as count FROM users WHERE role='user' AND body_type IS NOT NULL GROUP BY body_type").all();
  const recentSignups = prepare("SELECT id,name,email,created_at,goal,diet_type,is_active FROM users WHERE role='user' ORDER BY created_at DESC LIMIT 5").all();
  const activityLast7 = prepare(`
    SELECT date, COUNT(*) as entries, SUM(total_calories) as total_cal
    FROM trackers WHERE date >= date('now','-7 days')
    GROUP BY date ORDER BY date ASC
  `).all();

  res.json({
    totalUsers, activeUsers, totalTrackers, todayTrackers,
    newUsersToday, newUsersWeek,
    avgCalories: avgRow?.a ? Math.round(avgRow.a) : 0,
    goalBreakdown, dietBreakdown, bodyBreakdown,
    recentSignups, activityLast7,
  });
});

// ── All Users (paginated + searchable) ────────────────────────────────────────
router.get("/users", adminProtect, (req, res) => {
  const { search = "", page = 1, limit = 20 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);
  const like   = `%${search}%`;

  const users = prepare(`
    SELECT u.id, u.name, u.email, u.role, u.age, u.weight, u.height,
           u.goal, u.diet_type, u.medical_conditions, u.bmi, u.body_type,
           u.is_active, u.last_login, u.created_at,
           COUNT(t.id) as tracker_count,
           MAX(t.date) as last_tracked
    FROM users u
    LEFT JOIN trackers t ON t.user_id = u.id
    WHERE u.role = 'user' AND (u.name LIKE ? OR u.email LIKE ?)
    GROUP BY u.id
    ORDER BY u.created_at DESC
    LIMIT ? OFFSET ?
  `).all(like, like, parseInt(limit), offset);

  const total = prepare(
    "SELECT COUNT(*) as c FROM users WHERE role='user' AND (name LIKE ? OR email LIKE ?)"
  ).get(like, like).c;

  res.json({ users, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
});

// ── Single User ───────────────────────────────────────────────────────────────
router.get("/users/:id", adminProtect, (req, res) => {
  const user = prepare("SELECT * FROM users WHERE id = ?").get(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  delete user.password;
  const trackers = prepare("SELECT * FROM trackers WHERE user_id = ? ORDER BY date DESC LIMIT 30").all(req.params.id);
  res.json({ user, trackers });
});

// ── Update User ───────────────────────────────────────────────────────────────
router.put("/users/:id", adminProtect, (req, res) => {
  try {
    const { name, email, age, weight, height, goal, diet_type, is_active, role } = req.body;
    prepare(`
      UPDATE users SET
        name=COALESCE(?,name), email=COALESCE(?,email),
        age=COALESCE(?,age), weight=COALESCE(?,weight), height=COALESCE(?,height),
        goal=COALESCE(?,goal), diet_type=COALESCE(?,diet_type),
        is_active=COALESCE(?,is_active), role=COALESCE(?,role),
        updated_at=datetime('now')
      WHERE id=?
    `).run(name, email, age, weight, height, goal, diet_type,
           is_active !== undefined ? (is_active ? 1 : 0) : null,
           role, req.params.id);
    const u = prepare("SELECT * FROM users WHERE id=?").get(req.params.id);
    delete u.password;
    res.json(u);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── Toggle Active ─────────────────────────────────────────────────────────────
router.patch("/users/:id/toggle", adminProtect, (req, res) => {
  const user = prepare("SELECT id, is_active FROM users WHERE id=? AND role='user'").get(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  prepare("UPDATE users SET is_active=? WHERE id=?").run(user.is_active ? 0 : 1, user.id);
  res.json({ id: user.id, is_active: !user.is_active });
});

// ── Delete User ───────────────────────────────────────────────────────────────
router.delete("/users/:id", adminProtect, (req, res) => {
  const user = prepare("SELECT id, role FROM users WHERE id=?").get(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  if (user.role === "admin") return res.status(403).json({ message: "Cannot delete admin" });
  prepare("DELETE FROM trackers WHERE user_id=?").run(req.params.id);
  prepare("DELETE FROM users WHERE id=?").run(req.params.id);
  res.json({ message: "User deleted" });
});

// ── All Tracker Records ───────────────────────────────────────────────────────
router.get("/trackers", adminProtect, (req, res) => {
  const { page = 1, limit = 30, user_id } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  let records, total;
  if (user_id) {
    records = prepare(`
      SELECT t.*, u.name as user_name, u.email as user_email
      FROM trackers t JOIN users u ON u.id = t.user_id
      WHERE t.user_id = ? ORDER BY t.date DESC LIMIT ? OFFSET ?
    `).all(user_id, parseInt(limit), offset);
    total = prepare("SELECT COUNT(*) as c FROM trackers WHERE user_id=?").get(user_id).c;
  } else {
    records = prepare(`
      SELECT t.*, u.name as user_name, u.email as user_email
      FROM trackers t JOIN users u ON u.id = t.user_id
      ORDER BY t.date DESC, t.created_at DESC LIMIT ? OFFSET ?
    `).all(parseInt(limit), offset);
    total = prepare("SELECT COUNT(*) as c FROM trackers").get().c;
  }

  res.json({ records, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
});

// ── DB Viewer: every table, live ─────────────────────────────────────────────
const tableNames = () =>
  prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name").all().map((t) => t.name);

router.get("/db/tables", adminProtect, (req, res) => {
  const result = {};
  tableNames().forEach((name) => {
    result[name] = {
      columns:  prepare(`PRAGMA table_info(${name})`).all(),
      rowCount: prepare(`SELECT COUNT(*) as c FROM ${name}`).get().c,
    };
  });
  res.json({ tables: result, file: "server/data/kdp.db", engine: "SQLite (sql.js)" });
});

router.get("/db/table/:name", adminProtect, (req, res) => {
  const name = req.params.name;
  if (!tableNames().includes(name)) return res.status(404).json({ message: "Unknown table" });
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(200, parseInt(req.query.limit) || 50);
  const rows  = prepare(`SELECT * FROM ${name} ORDER BY rowid DESC LIMIT ? OFFSET ?`).all(limit, (page - 1) * limit);
  const total = prepare(`SELECT COUNT(*) as c FROM ${name}`).get().c;
  const columns = prepare(`PRAGMA table_info(${name})`).all().map((c) => c.name);
  res.json({ rows, total, columns, page, pages: Math.max(1, Math.ceil(total / limit)) });
});

// Read-only SQL console (SELECT / WITH / PRAGMA table_info only, single statement)
router.post("/db/query", adminProtect, (req, res) => {
  const sql = String(req.body.sql || "").trim().replace(/;+\s*$/, "");
  if (!sql) return res.status(400).json({ message: "Enter a SQL query" });
  if (sql.includes(";")) return res.status(400).json({ message: "Only one statement at a time" });
  if (!/^(select|with|pragma\s+table_info)\b/i.test(sql))
    return res.status(400).json({ message: "Read-only console: only SELECT queries are allowed" });
  if (/\b(insert|update|delete|drop|alter|create|replace|attach|detach|vacuum)\b/i.test(sql))
    return res.status(400).json({ message: "Read-only console: modifying statements are blocked" });
  try {
    const t0 = Date.now();
    const rows = prepare(sql).all();
    res.json({ rows: rows.slice(0, 500), columns: rows[0] ? Object.keys(rows[0]) : [], count: rows.length, ms: Date.now() - t0 });
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.get("/db/download", adminProtect, (req, res) => res.download(DB_PATH, "kdp.db"));

// ── Meals (food catalogue) CRUD ──────────────────────────────────────────────
router.get("/meals", adminProtect, (req, res) => {
  const { q = "", diet = "", goal = "", type = "" } = req.query;
  let sql = "SELECT * FROM meals WHERE (name LIKE ? OR name_kn LIKE ?)"; const p = [`%${q}%`, `%${q}%`];
  if (diet) { sql += " AND diet_type=?"; p.push(diet); }
  if (goal) { sql += " AND goal=?"; p.push(goal); }
  if (type) { sql += " AND meal_type=?"; p.push(type); }
  res.json(prepare(sql + " ORDER BY diet_type, goal, meal_type, name").all(...p));
});
router.post("/meals", adminProtect, (req, res) => {
  const m = req.body;
  if (!m.name || !m.diet_type || !m.goal || !m.meal_type || !m.calories)
    return res.status(400).json({ message: "name, diet_type, goal, meal_type and calories are required" });
  const r = prepare(`INSERT INTO meals (diet_type,goal,meal_type,name,name_kn,description,description_kn,calories,tags) VALUES (?,?,?,?,?,?,?,?,?)`)
    .run(m.diet_type, m.goal, m.meal_type, m.name, m.name_kn || null, m.description || "", m.description_kn || null, parseInt(m.calories), m.tags || "");
  res.status(201).json(prepare("SELECT * FROM meals WHERE id=?").get(r.lastInsertRowid));
});
router.put("/meals/:id", adminProtect, (req, res) => {
  const m = req.body;
  prepare(`UPDATE meals SET name=COALESCE(?,name), name_kn=COALESCE(?,name_kn), description=COALESCE(?,description),
           description_kn=COALESCE(?,description_kn), calories=COALESCE(?,calories), tags=COALESCE(?,tags),
           diet_type=COALESCE(?,diet_type), goal=COALESCE(?,goal), meal_type=COALESCE(?,meal_type) WHERE id=?`)
    .run(m.name ?? null, m.name_kn ?? null, m.description ?? null, m.description_kn ?? null,
         m.calories ? parseInt(m.calories) : null, m.tags ?? null, m.diet_type ?? null, m.goal ?? null, m.meal_type ?? null, req.params.id);
  res.json(prepare("SELECT * FROM meals WHERE id=?").get(req.params.id));
});
router.delete("/meals/:id", adminProtect, (req, res) => {
  prepare("DELETE FROM meals WHERE id=?").run(req.params.id);
  res.json({ message: "Meal deleted" });
});

// ── Contact messages inbox ───────────────────────────────────────────────────
router.get("/messages", adminProtect, (req, res) => {
  const messages = prepare("SELECT * FROM messages ORDER BY id DESC").all();
  res.json({ messages, unread: messages.filter((m) => !m.is_read).length });
});
router.patch("/messages/:id/read", adminProtect, (req, res) => {
  prepare("UPDATE messages SET is_read=1 WHERE id=?").run(req.params.id);
  res.json({ ok: true });
});
router.delete("/messages/:id", adminProtect, (req, res) => {
  prepare("DELETE FROM messages WHERE id=?").run(req.params.id);
  res.json({ message: "Deleted" });
});

// ── Change Admin Password ─────────────────────────────────────────────────────
router.put("/change-password", adminProtect, (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const admin = prepare("SELECT * FROM users WHERE id=?").get(req.user.id);
  if (!newPassword || newPassword.length < 6) return res.status(400).json({ message: "New password must be at least 6 characters" });
  if (!bcrypt.compareSync(currentPassword || "", admin.password))
    return res.status(400).json({ message: "Current password is wrong" });
  const hash = bcrypt.hashSync(newPassword, 10);
  prepare("UPDATE users SET password=? WHERE id=?").run(hash, req.user.id);
  res.json({ message: "Password updated" });
});

module.exports = router;
