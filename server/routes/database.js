/* eslint-disable no-undef */
const express = require("express");
const mysql = require("mysql2");

const router = express.Router();

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password@123",
  database: "hotels",
});

router.get("/database", (req, res) => {
  con.query("SHOW TABLES LIKE 'bookings'", (err, tables) => {
    if (err) {
      console.error("Error checking bookings table:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (!tables.length) {
      return res.status(404).json({
        success: false,
        error: "The existing bookings table was not found in hotels database",
      });
    }

    return res.json({
      success: true,
      message: "Connected to hotels database and found existing bookings table",
    });
  });
});

module.exports = router;
