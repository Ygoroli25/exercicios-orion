import express from "express";
import pkg from "pg";
const { Pool } = pkg;

const app = express();

const pool = new Pool({
  host: process.env.DB_HOST || "db",
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASS || "postgres",
  database: process.env.DB_NAME || "demo",
});

async function init() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS notes (
      id SERIAL PRIMARY KEY,
      msg TEXT NOT NULL
    );
  `);
  await pool.query(`INSERT INTO notes (msg) VALUES ('Hello from Docker + Postgres')`);
}

app.get("/", async (_req, res) => {
  const { rows } = await pool.query("SELECT msg FROM notes ORDER BY id DESC LIMIT 1");
  res.send(rows[0]?.msg || "no data");
});

app.get("/health", (_req, res) => res.json({ ok: true }));

const PORT = 3000;
app.listen(PORT, async () => {
  try {
    await init();
    console.log(`API running on http://localhost:${PORT}`);
  } catch (e) {
    console.error("DB init error:", e);
    process.exit(1);
  }
});
