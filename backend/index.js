const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const dotenv = require('dotenv');
const { exec } = require('child_process');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to SQLite database
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Error opening database ' + err.message);
  } else {
    console.log('Connected to SQLite database.');
  }
});

// Example route to check if the server is running
app.get('/', (req, res) => {
  res.send('Backend is running');
});

// Endpoint to get a list of bills
app.get('/api/bills', (req, res) => {
  db.all('SELECT * FROM bills', [], (err, rows) => {
    if (err) {
      throw err;
    }
    res.json(rows);
  });
});

// Endpoint to vote for a bill
app.post('/api/vote', (req, res) => {
  const { userId, billId, state, vote } = req.body;
  db.run(
    'INSERT INTO votes (user_id, bill_id, state, vote) VALUES (?, ?, ?, ?)',
    [userId, billId, state, vote],
    function (err) {
      if (err) {
        res.status(400).json({ error: err.message });
      } else {
        res.json({ id: this.lastID, userId, billId, state, vote });
      }
    }
  );
});

// Endpoint to create a user
app.post('/signup', (req, res) => {
  const { username, password, state } = req.body;

  // Check if username already exists
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    if (row) {
      return res.status(400).send('Username already exists');
    }

    // If username does not exist, insert the new user
    const stmt = db.prepare('INSERT INTO users (username, password, state) VALUES (?, ?, ?)');
    stmt.run(username, password, state, function (err) {
      if (err) {
        return res.status(500).send(err.message);
      }
      res.status(200).send({ id: this.lastID });
    });
    stmt.finalize();
  });
});

// Endpoint to login a user
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Check if the username and password match
  db.get('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, row) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    if (!row) {
      return res.status(400).send('Invalid username or password');
    }

    // If login is successful, send the user data
    res.status(200).send({ id: row.id, username: row.username, state: row.state });
  });
});


app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT || 5000}`);
});
