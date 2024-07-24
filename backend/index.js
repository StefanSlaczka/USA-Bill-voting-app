const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Example route to check if the server is running
app.get('/', (req, res) => {
  res.send('Backend is running');
});

// Endpoint to get a list of bills
app.get('/api/bills', async (req, res) => {
  const result = await pool.query('SELECT * FROM bills');
  res.json(result.rows);
});

// Endpoint to vote for a bill
app.post('/api/vote', async (req, res) => {
  const { userId, billId, state, vote } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO votes (user_id, bill_id, state, vote) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, billId, state, vote]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
