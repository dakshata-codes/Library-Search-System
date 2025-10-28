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
  user: 'root',
  password: '', // your MySQL password
  database: 'librarydb'
});

db.connect(err => {
  if (err) console.error('❌ Database connection failed:', err);
  else console.log('✅ Connected to MySQL database');
});

// --------------------
// TRIE DATA STRUCTURE
// --------------------
class TrieNode {
  constructor() {
    this.children = {};
    this.isEnd = false;
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  insert(word) {
    let node = this.root;
    for (let char of word.toLowerCase()) {
      if (!node.children[char]) node.children[char] = new TrieNode();
      node = node.children[char];
    }
    node.isEnd = true;
  }

  searchPrefix(prefix) {
    let node = this.root;
    for (let char of prefix.toLowerCase()) {
      if (!node.children[char]) return null;
      node = node.children[char];
    }
    return node;
  }

  getSuggestions(prefix) {
    const node = this.searchPrefix(prefix);
    if (!node) return [];
    const suggestions = [];

    const dfs = (currentNode, path) => {
      if (currentNode.isEnd) suggestions.push(path);
      for (let char in currentNode.children) {
        dfs(currentNode.children[char], path + char);
      }
    };

    dfs(node, prefix.toLowerCase());
    return suggestions;
  }
}

const trie = new Trie();

// Load data into Trie when server starts
db.query("SELECT title, author FROM books", (err, results) => {
  if (err) console.error("Error loading books into Trie:", err);
  else {
    results.forEach(book => {
      trie.insert(book.title);
      trie.insert(book.author);
    });
    console.log(" Trie built successfully with book data.");
  }
});

// -------------------------------------------
// API: Book search (exact/partial SQL lookup)
// -------------------------------------------
app.get("/search", (req, res) => {
  const query = req.query.query;
  if (!query) return res.status(400).json({ error: "Missing query parameter" });

  const sql = `
    SELECT * FROM books 
    WHERE book_id LIKE ? OR title LIKE ? OR author LIKE ?
  `;
  const values = [`%${query}%`, `%${query}%`, `%${query}%`];

  db.query(sql, values, (err, results) => {
    if (err) {
      console.error("Database query failed:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

// -------------------------------------------
// API: Autocomplete suggestions (Trie-based)
// -------------------------------------------
app.get("/suggest", (req, res) => {
  const prefix = req.query.prefix;
  if (!prefix) return res.json([]);
  const suggestions = trie.getSuggestions(prefix).slice(0, 10); // Limit to 10
  res.json(suggestions);
});

// Start server
app.listen(3000, () => {
  console.log(' Server running on http://localhost:3000');
});
