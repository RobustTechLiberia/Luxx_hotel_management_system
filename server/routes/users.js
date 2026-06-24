/* eslint-disable no-undef */
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
import {
  buildPasswordResetEmail,
  sendTransactionalEmail,
} from '../utils/email.js';

const router = express.Router();
const RESET_CODE_MINUTES = 10;

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

const ensurePasswordResetTable = async (db) => {
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS password_reset_codes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL,
      code_hash TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      used INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `).run();

  await db.prepare(`
    CREATE INDEX IF NOT EXISTS idx_password_reset_codes_email
    ON password_reset_codes(email, used, expires_at)
  `).run();
};

const normalizeEmail = (email = '') => String(email).trim().toLowerCase();

const getDbAndSecret = (req) => {
  const db = req.db;
  const JWT_SECRET = req.JWT_SECRET;

  if (!db) {
    throw new Error('Cloudflare D1 binding HOTELS_DB was not found. Check server/wrangler.toml.');
  }

  if (!JWT_SECRET) {
    throw new Error('Cloudflare Environment JWT_SECRET variable was not loaded properly.');
  }

  return { db, JWT_SECRET };
};

const getLatestValidResetCode = async (db, email) => {
  await ensurePasswordResetTable(db);

  return db.prepare(`
    SELECT * FROM password_reset_codes
    WHERE email = ? AND used = 0 AND expires_at > datetime('now')
    ORDER BY id DESC
    LIMIT 1
  `).bind(email).first();
};

const verifyResetCode = async (db, email, code) => {
  if (!/^\d{4}$/.test(code)) return null;

  const resetCode = await getLatestValidResetCode(db, email);
  if (!resetCode) return null;

  const matches = bcrypt.compareSync(code, resetCode.code_hash);
  return matches ? resetCode : null;
};

const signupHandler = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const { db, JWT_SECRET } = getDbAndSecret(req);

    await ensureUserTable(db);

    const salt = bcrypt.genSaltSync(10);
    const hashed = bcrypt.hashSync(password, salt);

    const insertSql =
      'INSERT INTO user_credentials (username, email, password) VALUES (?, ?, ?)';

    const result = await db.prepare(insertSql).bind(username, normalizeEmail(email), hashed).run();

    const token = jwt.sign({ email: normalizeEmail(email), username }, JWT_SECRET, {
      expiresIn: '2h',
    });

    return res.status(201).json({
      success: true,
      message: 'Account created',
      token,
      user: {
        id: result.meta?.last_row_id || null,
        username,
        email: normalizeEmail(email),
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

    const { db, JWT_SECRET } = getDbAndSecret(req);

    await ensureUserTable(db);

    const sql = 'SELECT * FROM user_credentials WHERE email = ? LIMIT 1';
    const user = await db.prepare(sql).bind(normalizeEmail(email)).first();

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

const requestPasswordResetHandler = async (req, res) => {
  try {
    const email = normalizeEmail(req.body?.email);

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ success: false, error: 'A valid email address is required.' });
    }

    const { db } = getDbAndSecret(req);
    await ensureUserTable(db);
    await ensurePasswordResetTable(db);

    const user = await db.prepare('SELECT id, email FROM user_credentials WHERE email = ? LIMIT 1').bind(email).first();

    if (!user) {
      return res.json({
        success: true,
        message: 'If that email is registered, a verification code has been sent.',
      });
    }

    const code = crypto.randomInt(1000, 10000).toString();
    const codeHash = bcrypt.hashSync(code, bcrypt.genSaltSync(10));
    const expiresAt = new Date(Date.now() + RESET_CODE_MINUTES * 60 * 1000).toISOString();

    await db.prepare('UPDATE password_reset_codes SET used = 1 WHERE email = ? AND used = 0').bind(email).run();
    await db.prepare(`
      INSERT INTO password_reset_codes (email, code_hash, expires_at)
      VALUES (?, ?, ?)
    `).bind(email, codeHash, expiresAt).run();

    const emailBody = buildPasswordResetEmail({ code });
    await sendTransactionalEmail(req.env || {}, {
      to: email,
      ...emailBody,
    });

    return res.json({
      success: true,
      message: 'A verification code has been sent to your email.',
    });
  } catch (err) {
    console.error('Password reset request error:', err);
    return res.status(500).json({
      success: false,
      error: 'Could not send the verification code.',
      details: err.message,
    });
  }
};

const verifyPasswordResetHandler = async (req, res) => {
  try {
    const email = normalizeEmail(req.body?.email);
    const code = String(req.body?.code || '').trim();

    if (!email || !code) {
      return res.status(400).json({ success: false, error: 'Email and verification code are required.' });
    }

    const { db } = getDbAndSecret(req);
    const resetCode = await verifyResetCode(db, email, code);

    if (!resetCode) {
      return res.status(400).json({ success: false, error: 'Invalid or expired verification code.' });
    }

    return res.json({ success: true, message: 'Verification code accepted.' });
  } catch (err) {
    console.error('Password reset verify error:', err);
    return res.status(500).json({ success: false, error: 'Could not verify the code.', details: err.message });
  }
};

const resetPasswordHandler = async (req, res) => {
  try {
    const email = normalizeEmail(req.body?.email);
    const code = String(req.body?.code || '').trim();
    const password = String(req.body?.password || '');

    if (!email || !code || !password) {
      return res.status(400).json({ success: false, error: 'Email, code, and new password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters.' });
    }

    const { db } = getDbAndSecret(req);
    await ensureUserTable(db);

    const resetCode = await verifyResetCode(db, email, code);

    if (!resetCode) {
      return res.status(400).json({ success: false, error: 'Invalid or expired verification code.' });
    }

    const hashed = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    const result = await db.prepare('UPDATE user_credentials SET password = ? WHERE email = ?').bind(hashed, email).run();

    if (!result?.success) {
      throw new Error('D1 rejected the password update.');
    }

    await db.prepare('UPDATE password_reset_codes SET used = 1 WHERE id = ?').bind(resetCode.id).run();

    return res.json({ success: true, message: 'Password reset successfully. You can now log in.' });
  } catch (err) {
    console.error('Password reset error:', err);
    return res.status(500).json({ success: false, error: 'Could not reset password.', details: err.message });
  }
};

router.post('/signup', signupHandler);
router.post('/api/users/register', signupHandler);

router.post('/login', loginHandler);
router.post('/api/users/login', loginHandler);

router.post('/forgot-password/request', requestPasswordResetHandler);
router.post('/forgot-password/verify', verifyPasswordResetHandler);
router.post('/forgot-password/reset', resetPasswordHandler);

export default router;
