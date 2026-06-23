/* eslint-disable no-undef */
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();

const ensureUserTable = async (db) => {
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS user_credentials (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `).run();
};

const signupHandler = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const db = req.db;
    const JWT_SECRET = req.JWT_SECRET;

    if (!db) {
      throw new Error('Cloudflare D1 binding HOTELS_DB was not found. Check server/wrangler.toml.');
    }

    if (!JWT_SECRET) {
      throw new Error('Cloudflare Environment JWT_SECRET variable was not loaded properly.');
    }

    await ensureUserTable(db);

    const salt = bcrypt.genSaltSync(10);
    const hashed = bcrypt.hashSync(password, salt);

    const insertSql =
      'INSERT INTO user_credentials (username, email, password) VALUES (?, ?, ?)';

    const result = await db.prepare(insertSql).bind(username, email, hashed).run();

    const token = jwt.sign({ email, username }, JWT_SECRET, {
      expiresIn: '2h',
    });

    return res.status(201).json({
      success: true,
      message: 'Account created',
      token,
      user: {
        id: result.meta?.last_row_id || null,
        username,
        email,
      },
    });
  } catch (err) {
    console.error('D1 error (signup):', err);
    if (err.message && err.message.includes('UNIQUE constraint failed')) {
      return res.status(409).json({ error: 'Email already registered' });
    }
    return res.status(500).json({ error: 'Database error', details: err.message });
  }
};

const loginHandler = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Missing email or password' });
    }

    const db = req.db;
    const JWT_SECRET = req.JWT_SECRET;

    if (!db) {
      throw new Error('Cloudflare D1 binding HOTELS_DB was not found. Check server/wrangler.toml.');
    }

    if (!JWT_SECRET) {
      throw new Error('Cloudflare Environment JWT_SECRET variable was not loaded properly.');
    }

    await ensureUserTable(db);

    const sql = 'SELECT * FROM user_credentials WHERE email = ? LIMIT 1';
    const user = await db.prepare(sql).bind(email).first();

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const hashed = user.password;
    let passwordMatches = false;

    try {
      passwordMatches = bcrypt.compareSync(password, hashed);
    } catch (err) {
      console.error('bcrypt compare error:', err);
      passwordMatches = false;
    }

    if (!passwordMatches && hashed === password) {
      passwordMatches = true;
    }

    if (!passwordMatches) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { email: user.email, username: user.username || user.name || null },
      JWT_SECRET,
      { expiresIn: '2h' },
    );

    return res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username || user.name || null,
        email: user.email,
      },
    });
  } catch (err) {
    console.error('D1 error (login):', err);
    return res.status(500).json({ error: 'Database error', details: err.message });
  }
};

router.post('/signup', signupHandler);
router.post('/api/users/register', signupHandler);

router.post('/login', loginHandler);
router.post('/api/users/login', loginHandler);

export default router;
