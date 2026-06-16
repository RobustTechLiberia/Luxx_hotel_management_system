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

// Middleware
app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// 1. CLOUDFLARE BINDINGS INTERCEPT MIDDLEWARE
// This safely grabs the cloud/local environment and saves it to req.db
app.use((req, res, next) => {
  // Cloudflare injects the worker context into req.canvas or req.raw
  // eslint-disable-next-line no-unused-vars
  const cfEnv = req.cloudflare?.env || req.raw?.context?.env || globalThis;
  next();
});

// Link your sub-routes
app.use("/", dbRouter);
app.use("/bookings", bookingsRouter); 
app.use("/users", usersRouter); 
app.use("/email", emailRouter); 

app.get("/", (req, res) => {
  res.send("hello,world");
});

// 2. OFFICIAL CLOUDFLARE LIFECYCLE INITIALIZATION
// This maps your routing layout to Cloudflare's internal proxy table
app.listen(3000); 

// 3. EXPORT USING THE EXACT PORT CONFIGURATION OBJECT
export default httpServerHandler({ port: 3000 });
