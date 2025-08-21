const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'securin'
};

let connection;

async function initializeDatabase() {
  try {
    connection = await mysql.createPool(dbConfig);
    console.log('Connected to MySQL database');
  } catch (err) {
    console.error('Database connection failed:', err.message);
    process.exit(1);
  }
}

app.get('/api/recipes', async (req, res) => {
  try {
    const sql = `
      SELECT id, title, cuisine, rating, total_time, serves, description, nutrients
      FROM recipes
      ORDER BY id ASC
    `;
    const [rows] = await pool.execute(sql);

    const data = rows.map((row) => {
      let nutrientsObj = null;
      if (row.nutrients) {
        try { nutrientsObj = JSON.parse(row.nutrients); } catch (_) {}
      }
      return { ...row, nutrients: nutrientsObj };
    });

    res.json({ data });
  } catch (err) {
    console.error('Error fetching recipes:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

async function startServer() {
  await initializeDatabase();
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`➡️  API available at http://localhost:${PORT}/api/recipes`);
  });
}

startServer();
