// server.js
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',     // default MySQL username
  password: '',     // your MySQL password (keep empty if none)
  database: 'librarydb'
});

db.connect(err => {
  if (err) {
    console.error('❌ Database connection failed:', err);
  } else {
    console.log('✅ Connected to MySQL database');
  }
});

//  API endpoint: Search book by ID
app.get("/search", (req, res) => {
  const query = req.query.query;
  if (!query) return res.status(400).json({ error: "Missing query parameter" });

  // If input is numeric, search by book_id; else, search by title/author
  const sql =
    isNaN(query)
      ? `SELECT * FROM books WHERE title LIKE ? OR author LIKE ?`
      : `SELECT * FROM books WHERE book_id = ? OR title LIKE ? OR author LIKE ?`;

  const values = isNaN(query)
    ? [`%${query}%`, `%${query}%`]
    : [query, `%${query}%`, `%${query}%`];

  db.query(sql, values, (err, results) => {
    if (err) {
      console.error("Database query failed:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});


//  Start server
app.listen(3000, () => {
  console.log('🚀 Server running on http://localhost:3000');
});
