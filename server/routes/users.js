/* eslint-disable no-undef */
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();
const JWT_SECRET = "supersecretkey"; // Define fallback globally or via wrangler configuration

// manages user credentials

// sign up route
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // CRITICAL FIX: Robust fallback line to dynamically grab your D1 Database instance
    const db = req.cloudflare?.env?.DB || globalThis.env?.DB || req.raw?.context?.env?.DB;

    if (!db) {
      throw new Error("Cloudflare D1 Database binding was not found or failed to initialize.");
    }

    // ensure table exists (SQLite compatible format)
    const createTableSql = `CREATE TABLE IF NOT EXISTS user_credentials (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );`;

    await db.prepare(createTableSql).run();

    // hash password
    const salt = bcrypt.genSaltSync(10);
    const hashed = bcrypt.hashSync(password, salt);

    const insertSql =
      "INSERT INTO user_credentials (username, email, password) VALUES (?, ?, ?)";

    const result = await db.prepare(insertSql).bind(username, email, hashed).run();

    const token = jwt.sign({ email, username }, JWT_SECRET, {
      expiresIn: "2h",
    });

    return res.status(201).json({
      success: true,
      message: "Account created",
      token,
      user: {
        id: result.meta.last_row_id || null, // D1 uses last_row_id instead of insertId
        username,
        email,
      },
    });

  } catch (err) {
    console.error("D1 error (signup):", err);
    // SQLite checks for unique constraint violations with constraint message checks
    if (err.message && err.message.includes("UNIQUE constraint failed")) {
      return res.status(409).json({ error: "Email already registered" });
    }
    return res.status(500).json({ error: "Database error" });
  }
});

// login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Missing email or password" });
    }

    // CRITICAL FIX: Robust fallback line to dynamically grab your D1 Database instance
    const db = req.cloudflare?.env?.DB || globalThis.env?.DB || req.raw?.context?.env?.DB;

    if (!db) {
      throw new Error("Cloudflare D1 Database binding was not found or failed to initialize.");
    }

    const sql = "SELECT * FROM user_credentials WHERE email = ? LIMIT 1";
    
    // Fetch a single row using D1 first() syntax
    const user = await db.prepare(sql).bind(email).first();

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const hashed = user.password;

    // Compare password
    let passwordMatches = false;
    try {
      passwordMatches = bcrypt.compareSync(password, hashed);
    } catch (err) {
      console.error("bcrypt compare error:", err);
      passwordMatches = false;
    }

    // fallback if password stored as plain text
    if (!passwordMatches && hashed === password) {
      passwordMatches = true;
    }

    if (!passwordMatches) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { email: user.email, username: user.username || user.name || null },
      JWT_SECRET,
      { expiresIn: "2h" },
    );

    return res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username || user.name || null,
        email: user.email,
      },
    });

  } catch (err) {
    console.error("D1 error (login):", err);
    return res.status(500).json({ error: "Database error" });
  }
});

export default router;
