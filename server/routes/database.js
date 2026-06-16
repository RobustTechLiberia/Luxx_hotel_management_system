/* eslint-disable no-undef */
import express from 'express';

const router = express.Router();

router.get("/database", async (req, res) => {
  try {
    // Safely extract Cloudflare D1 database binding passed from the fetch handler
    const db = req.raw?.env?.DB || req.env?.DB;

    // Guard clause in case the binding isn't set up correctly in wrangler.toml
    if (!db) {
      return res.status(500).json({
        success: false,
        error: "Database binding 'DB' is missing or not configured.",
      });
    }

    // Query D1 to check for the 'bookings' table
    const { results } = await db
      .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='bookings'")
      .all();

    if (!results || results.length === 0) {
      return res.status(404).json({
        success: false,
        error: "The existing bookings table was not found in hotels database",
      });
    }

    return res.json({
      success: true,
      message: "Connected to Cloudflare D1 hotels database and found existing bookings table",
    });

  } catch (err) {
    console.error("Error checking bookings table in D1:", err);
    return res.status(500).json({ 
      success: false, 
      error: `Cloudflare D1 Database communication error: ${err.message}` 
    });
  }
});

export default router;