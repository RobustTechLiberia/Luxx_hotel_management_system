/* eslint-disable no-undef */
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();
const JWT_SECRET = "supersecretkey";

// sign up route
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Fetch the cleanly bound D1 instance attached via app.js middleware
    const db = req.db;

    if (!db) {
      throw new Error("Cloudflare D1 database reference failed to inject via core handler middleware.");
    }

    // hash password
    const salt = bcrypt.genSaltSync(10);
    const hashed = bcrypt.hashSync(password, salt);

    // Insert directly since table was already built via Wrangler command
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
        id: result.meta.last_row_id || null,
        username,
        email,
      },
    });

  } catch (err) {
    console.error("D1 error (signup):", err);
    if (err.message && err.message.includes("UNIQUE constraint failed")) {
      return res.status(409).json({ error: "Email already registered" });
    }
    return res.status(500).json({ error: "Database error", details: err.message });
  }
});

// login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Missing email or password" });
    }

    const db = req.db;

    if (!db) {
      throw new Error("Cloudflare D1 database reference failed to inject via core handler middleware.");
    }

    const sql = "SELECT * FROM user_credentials WHERE email = ? LIMIT 1";
    const user = await db.prepare(sql).bind(email).first();

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const hashed = user.password;
    let passwordMatches = false;
    
    try {
      passwordMatches = bcrypt.compareSync(password, hashed);
    } catch (err) {
      console.error("bcrypt compare error:", err);
      passwordMatches = false;
    }

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
    return res.status(500).json({ error: "Database error", details: err.message });
  }
});

export default router;
