const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'securin'
};

const pool = mysql.createPool(dbConfig);

app.get('/api/recipes', async (req, res) => {
  try {
    const sql = `
      SELECT id, title, cuisine, rating, total_time, serves, description, nutrients
      FROM recipes
      ORDER BY id ASC
    `;
    const [rows] = await pool.execute(sql);
    res.json({ data: rows });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
