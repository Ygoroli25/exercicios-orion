import express from "express";
import pkg from "pg";

const { Pool } = pkg;

const {
  DB_HOST = "db",
  DB_PORT = "5432",
  DB_USER = "postgres",
  DB_PASS = "postgres",
  DB_NAME = "appdb",
  PORT = 3000,
} = process.env;

const pool = new Pool({
  host: DB_HOST,
  port: Number(DB_PORT),
  user: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
});

const app = express();

// cria tabela se não existir
async function ensureSchema() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS hits (
      id SERIAL PRIMARY KEY,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);
}

app.get("/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok", db: "ok" });
  } catch (e) {
    res.status(500).json({ status: "error", db: "down", error: String(e) });
  }
});

app.get("/", async (req, res) => {
  await pool.query("INSERT INTO hits DEFAULT VALUES");
  const { rows } = await pool.query("SELECT COUNT(*)::int AS total FROM hits");
  res.send(`Hello from API + Postgres + Adminer (hits: ${rows[0].total})`);
});

app.listen(PORT, async () => {
  try {
    await ensureSchema();
    console.log(`API running on http://localhost:${PORT}`);
  } catch (e) {
    console.error("DB init error:", e);
    process.exit(1);
  }
});
