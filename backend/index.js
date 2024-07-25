const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to SQLite database
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Error opening database ' + err.message);
  } else {
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT,
      password TEXT,
      state TEXT
    )`);
    console.log('Connected to SQLite database.');
  }
});

// Endpoint to create a user
app.post('/signup', (req, res) => {
  const { username, password, state } = req.body;
  const stmt = db.prepare('INSERT INTO users (username, password, state) VALUES (?, ?, ?)');
  stmt.run(username, password, state, function (err) {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.status(200).send({ id: this.lastID });
  });
  stmt.finalize();
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
