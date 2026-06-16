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

// Standard App Middleware
app.use(cors());
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

// START EXPRESS INTERNAL ROUTER LOOP
const server = app.listen(3000); 

// OFFICIAL CLOUDFLARE CONFIGURATION EXPORT
export default httpServerHandler(server, {
  async fetch(request, env, ctx) {
    // Intercept every single web request globally 
    // and attach your D1 database configuration to Express
    app.use((req, res, next) => {
      req.db = env.DB; 
      next();
    });

    // Pass execution down to the underlying handler pipeline
    return httpServerHandler(server).fetch(request, env, ctx);
  }
});
