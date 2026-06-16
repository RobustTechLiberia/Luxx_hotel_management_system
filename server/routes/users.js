/* eslint-disable no-undef */
const express = require("express");
const router = express.Router();
const mysql = require("mysql2");

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password@123",
  database: "hotels",
});

// establish connection and log any errors
con.connect((err) => {
  if (err) {
    console.error("Database connection error:", err);
    return;
  }

  console.log("connected");
});

// manages user credentials

// sign up route
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

router.post("/signup", (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // ensure table exists (non-destructive)
  const createTableSql = `CREATE TABLE IF NOT EXISTS user_credentials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`;

  con.query(createTableSql, (err) => {
    if (err) {
      console.error("Error ensuring user_credentials table:", err);
      return res.status(500).json({ error: "Database error" });
    }

    // hash password
    const salt = bcrypt.genSaltSync(10);
    const hashed = bcrypt.hashSync(password, salt);

    const insertSql =
      "INSERT INTO user_credentials (username, email, password) VALUES (?, ?, ?)";

    con.query(insertSql, [username, email, hashed], (err, result) => {
      if (err) {
        console.error("DB error (signup):", err);
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(409).json({ error: "Email already registered" });
        }
        return res.status(500).json({ error: "Database error" });
      }

      const token = jwt.sign({ email, username }, JWT_SECRET, {
        expiresIn: "2h",
      });

      return res.status(201).json({
        success: true,
        message: "Account created",
        token,
        user: {
          id: result.insertId,
          username,
          email,
        },
      });
    });
  });
});

// login route
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Missing email or password" });
  }

  const sql = "SELECT * FROM user_credentials WHERE email = ? LIMIT 1";
  con.query(sql, [email], (err, results) => {
    if (err) {
      console.error("DB error (login):", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (!results || results.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = results[0];
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
  });
});

module.exports = router;
