/* eslint-disable no-undef */
import express from 'express';

const router = express.Router();

// send client email notification
// Placeholder routes can be added here when needed
router.get("/", (req, res) => {
  res.json({ success: true, message: "Email system ready" });
});

// Export the router using ES Modules syntax
export default router;
