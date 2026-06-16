/* eslint-disable no-undef */
import express from 'express';
import cors from 'cors';
import { httpServerHandler } from 'cloudflare:node'; 

// Import your sub-routers
import dbRouter from './routes/database.js';
import bookingsRouter from './routes/bookings.js';
import usersRouter from './routes/users.js';
import emailRouter from './routes/email.js';

const app = express();

// --- CONNECT FRONTEND VIA CORS ---
const allowedOrigins = [
  'https://luxx.gabrielwkun.workers.dev', // Your live Cloudflare frontend
  'http://localhost:5173',               // Vite local development
  'http://localhost:3000'                // Create React App local development
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, postman, or curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
// ---------------------------------

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// Link your sub-routes
app.use("/", dbRouter);
app.use("/bookings", bookingsRouter); 
app.use("/users", usersRouter); 
app.use("/email", emailRouter); 

app.get("/home", (req, res) => {
  res.send("hello,world");
});

const port = process.env.PORT || 3000;
const server = app.listen(port); 

const handler = httpServerHandler(server);

export default {
  async fetch(request, env, ctx) {
    request.env = env; 
    return handler.fetch(request, env, ctx);
  }
};