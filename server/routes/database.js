/* eslint-disable no-undef */
import express from 'express';

const router = express.Router();

router.get("/database", async (req, res) => {
  try {
  
    const db = req.cloudflare.env.DB;

    
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
      error: "Cloudflare D1 Database communication error" 
    });
  }
});

export default router;
