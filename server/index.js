// index.js — Karnataka Diet Planner server
// Serves the REST API (/api/*) AND the built React website, so opening
// http://localhost:5000 lands directly on the public home page.
const express = require("express");
const cors    = require("cors");
const path    = require("path");
const fs      = require("fs");
require("dotenv").config();

const { init } = require("./config/db");

async function start() {
  await init();
  const app = express();

  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json());

  app.use("/api/public",    require("./routes/public"));
  app.use("/api/auth",      require("./routes/auth"));
  app.use("/api/diet",      require("./routes/diet"));
  app.use("/api/tracker",   require("./routes/tracker"));
  app.use("/api/dashboard", require("./routes/dashboard"));
  app.use("/api/admin",     require("./routes/admin"));
  app.get("/api/health", (req, res) => res.json({ status: "OK", db: "SQLite", time: new Date().toISOString() }));
  app.use("/api", (req, res) => res.status(404).json({ message: "API route not found" }));

  // ── Serve the website (client/dist) with SPA fallback ──
  const dist = path.join(__dirname, "..", "client", "dist");
  const hasBuild = fs.existsSync(path.join(dist, "index.html"));
  if (hasBuild) {
    app.use(express.static(dist));
    app.get("*", (req, res) => res.sendFile(path.join(dist, "index.html")));
  } else {
    app.get("/", (req, res) => res.send(
      "<h2 style='font-family:sans-serif'>API is running ✅</h2><p style='font-family:sans-serif'>The website is not built yet. Run <code>npm run build</code> in <code>client/</code> (or use <code>npm run dev</code> and open http://localhost:5173).</p>"));
  }

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Website:  http://localhost:${PORT}${hasBuild ? "" : "   (not built — see message in browser)"}`);
    console.log(`🛡️  Admin:    http://localhost:${PORT}/admin/login`);
    console.log(`🗄️  DB file:  server/data/kdp.db\n`);
  });
}
start().catch((err) => { console.error("❌ Startup failed:", err); process.exit(1); });
