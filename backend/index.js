const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { exec } = require('child_process');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const SECRET_KEY = process.env.SECRET_KEY || 'your_secret_key';

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

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Endpoint to get a list of bills
app.get('/api/bills', authenticateToken, (req, res) => {
  db.all('SELECT * FROM bills', [], (err, rows) => {
    if (err) {
      throw err;
    }
    res.json(rows);
  });
});

// Endpoint to vote for a bill
app.post('/api/vote', authenticateToken, (req, res) => {
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
app.post('/signup', async (req, res) => {
  const { username, password, state } = req.body;

  // Check if username already exists
  db.get('SELECT * FROM users WHERE username = ?', [username], async (err, row) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    if (row) {
      return res.status(400).send('Username already exists');
    }

    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // If username does not exist, insert the new user
    const stmt = db.prepare('INSERT INTO users (username, password, state) VALUES (?, ?, ?)');
    stmt.run(username, hashedPassword, state, function (err) {
      if (err) {
        return res.status(500).send(err.message);
      }

      const token = jwt.sign({ username, state }, SECRET_KEY, { expiresIn: '7d' });
      res.status(200).send({ id: this.lastID, token });
    });
    stmt.finalize();
  });
});

// Endpoint to login a user
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Check if the username and password match
  db.get('SELECT * FROM users WHERE username = ?', [username], async (err, row) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    if (!row) {
      return res.status(400).send('Invalid username or password');
    }

    const validPassword = await bcrypt.compare(password, row.password);
    if (!validPassword) {
      return res.status(400).send('Invalid username or password');
    }

    const token = jwt.sign({ username: row.username, state: row.state }, SECRET_KEY, { expiresIn: '7d' });
    res.status(200).send({ token, username: row.username, state: row.state });
  });
});

// Endpoint to validate token
app.post('/validate-token', (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(401).send('Token required');

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).send('Invalid token');

    res.status(200).send({ valid: true, username: user.username, state: user.state });
  });
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT || 5000}`);
});
