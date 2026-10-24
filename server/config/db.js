// config/db.js — SQLite via sql.js (pure JavaScript, no native compilation)
const fs     = require("fs");
const path   = require("path");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const DB_PATH = path.join(__dirname, "..", "data", "kdp.db");
const dataDir = path.join(__dirname, "..", "data");
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const initSqlJs = require("sql.js");
let DB = null;
let batching = false;

function persist() {
  if (batching) return;
  fs.writeFileSync(DB_PATH, Buffer.from(DB.export()));
}

// better-sqlite3 style API: prepare(sql).get / all / run
function prepare(sql) {
  return {
    get(...params) {
      const stmt = DB.prepare(sql);
      stmt.bind(params);
      const cols = stmt.getColumnNames();
      let row;
      if (stmt.step()) {
        const vals = stmt.get();
        row = {};
        cols.forEach((c, i) => (row[c] = vals[i]));
      }
      stmt.free();
      return row;
    },
    all(...params) {
      const stmt = DB.prepare(sql);
      stmt.bind(params);
      const cols = stmt.getColumnNames();
      const rows = [];
      while (stmt.step()) {
        const vals = stmt.get();
        const row = {};
        cols.forEach((c, i) => (row[c] = vals[i]));
        rows.push(row);
      }
      stmt.free();
      return rows;
    },
    run(...params) {
      const stmt = DB.prepare(sql);
      stmt.run(params);
      stmt.free();
      const lastId = DB.exec("SELECT last_insert_rowid() as id")[0]?.values[0][0] ?? null;
      persist();
      return { lastInsertRowid: lastId };
    },
  };
}

function exec(sql) { DB.run(sql); persist(); }

// Run many writes, save to disk once
function transaction(fn) {
  batching = true;
  DB.run("BEGIN");
  try { fn(); DB.run("COMMIT"); }
  catch (e) { DB.run("ROLLBACK"); throw e; }
  finally { batching = false; }
  persist();
}

function computeBMI(weight, height) {
  if (!weight || !height) return { bmi: null, bodyType: null };
  const h = height / 100;
  const bmi = parseFloat((weight / (h * h)).toFixed(1));
  const bodyType = bmi < 18.5 ? "underweight" : bmi < 25 ? "normal" : bmi < 30 ? "overweight" : "obese";
  return { bmi, bodyType };
}

// Local (not UTC) YYYY-MM-DD — avoids off-by-one-day errors in IST
function localDate(d = new Date()) {
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

async function init() {
  const SQL = await initSqlJs();
  if (fs.existsSync(DB_PATH)) {
    DB = new SQL.Database(fs.readFileSync(DB_PATH));
    console.log(`✅ SQLite loaded from ${DB_PATH}`);
  } else {
    DB = new SQL.Database();
    console.log(`✅ SQLite created at ${DB_PATH}`);
  }

  DB.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      age INTEGER, weight REAL, height REAL,
      gender TEXT, region TEXT,
      activity_level TEXT DEFAULT 'moderate',
      goal TEXT DEFAULT 'maintain',
      diet_type TEXT DEFAULT 'vegetarian',
      medical_conditions TEXT DEFAULT 'none',
      bmi REAL, body_type TEXT,
      is_active INTEGER DEFAULT 1,
      last_login TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS trackers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      breakfast_name TEXT, breakfast_cal INTEGER DEFAULT 0, breakfast_done INTEGER DEFAULT 0,
      lunch_name TEXT,     lunch_cal INTEGER DEFAULT 0,     lunch_done INTEGER DEFAULT 0,
      dinner_name TEXT,    dinner_cal INTEGER DEFAULT 0,    dinner_done INTEGER DEFAULT 0,
      snack_name TEXT,     snack_cal INTEGER DEFAULT 0,     snack_done INTEGER DEFAULT 0,
      water_intake INTEGER DEFAULT 0,
      total_calories INTEGER DEFAULT 0,
      notes TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      UNIQUE(user_id, date),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
    CREATE TABLE IF NOT EXISTS meals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      diet_type TEXT NOT NULL,
      goal TEXT NOT NULL,
      meal_type TEXT NOT NULL,
      name TEXT NOT NULL,
      name_kn TEXT,
      description TEXT,
      description_kn TEXT,
      calories INTEGER NOT NULL,
      tags TEXT DEFAULT ''
    );
    CREATE TABLE IF NOT EXISTS conditions (
      key TEXT PRIMARY KEY,
      label TEXT NOT NULL,
      label_kn TEXT,
      tip TEXT,
      tip_kn TEXT,
      avoid TEXT DEFAULT '',
      prefer TEXT DEFAULT '',
      warning_foods TEXT DEFAULT ''
    );
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT,
      message TEXT NOT NULL,
      is_read INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);
  persist();

  // ── Seed catalogue (first run only) ─────────────────────────────────────────
  const seed = require("../data/seedData");
  if (prepare("SELECT COUNT(*) AS c FROM meals").get().c === 0) {
    transaction(() => {
      seed.flattenMeals().forEach((m) =>
        prepare(`INSERT INTO meals (diet_type,goal,meal_type,name,name_kn,description,description_kn,calories,tags)
                 VALUES (?,?,?,?,?,?,?,?,?)`)
          .run(m.diet_type, m.goal, m.meal_type, m.name, m.name_kn, m.description, m.description_kn, m.calories, m.tags));
    });
    console.log("🍛 Seeded meals table");
  }
  if (prepare("SELECT COUNT(*) AS c FROM conditions").get().c === 0) {
    transaction(() => {
      seed.conditions.forEach((c) =>
        prepare(`INSERT INTO conditions (key,label,label_kn,tip,tip_kn,avoid,prefer,warning_foods) VALUES (?,?,?,?,?,?,?,?)`)
          .run(c.key, c.label, c.label_kn, c.tip, c.tip_kn, c.avoid.join("|"), c.prefer.join("|"), c.warning.join("|")));
    });
    console.log("⚕️  Seeded conditions table");
  }

  // ── Seed admin ──────────────────────────────────────────────────────────────
  const adminEmail = (process.env.ADMIN_EMAIL || "admin@kdp.com").toLowerCase();
  if (!prepare("SELECT id FROM users WHERE email = ?").get(adminEmail)) {
    const hash = bcrypt.hashSync(process.env.ADMIN_PASSWORD || "Admin@1234", 10);
    prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'admin')").run("Admin", adminEmail, hash);
    console.log(`✅ Admin seeded: ${adminEmail}`);
  }
  console.log("🗄️  Database ready\n");
}

module.exports = { prepare, exec, transaction, init, computeBMI, localDate, DB_PATH };
