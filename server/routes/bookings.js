import express from 'express';
import bookingRouter from './routes/bookings.js'; 

const app = express();


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  next();
});


app.use(express.json());


app.use('/', bookingRouter);

// 4. Global Error Catch-All fallback
// We add an eslint disable comment for this line so it ignores the unused next variable,
// keeping the 4-argument signature that Express requires.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error("Global Server Failure:", err);
  return res.status(500).json({
    success: false,
    error: "Internal Server Error Environment Exception",
    details: err.message
  });
});

export default app;