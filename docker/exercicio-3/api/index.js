import express from 'express';
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  host: process.env.DB_HOST || 'db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'postgres',
  database: process.env.DB_NAME || 'appdb',
});

async function waitForDb(maxTries = 30, sleepMs = 2000) {
  for (let i = 1; i <= maxTries; i++) {
    try {
      await pool.query('SELECT 1');
      console.log('DB is ready!');
      return;
    } catch (err) {
      console.log(`DB not ready (${i}/${maxTries})...`, err.code || err.message);
      await new Promise(r => setTimeout(r, sleepMs));
    }
  }
  throw new Error('DB not ready after retries');
}

async function init() {
  // espera DB ficar pronto
  await waitForDb();

  // (opcional) cria tabela de teste
  await pool.query(`
    CREATE TABLE IF NOT EXISTS hits (
      id SERIAL PRIMARY KEY,
      at TIMESTAMP DEFAULT NOW()
    );
  `);
}

const app = express();

app.get('/', async (req, res) => {
  await pool.query('INSERT INTO hits DEFAULT VALUES;');
  const { rows } = await pool.query('SELECT COUNT(*) AS c FROM hits;');
  res.send(`Hello from Docker + Postgres (hits: ${rows[0].c})`);
});

const PORT = 3000;

init()
  .then(() => {
    app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('DB init error:', err);
    process.exit(1); // em dev, o nodemon religa
  });
