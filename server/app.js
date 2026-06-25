/* eslint-disable no-undef */
import express from 'express';
import cors from 'cors';
import { httpServerHandler } from 'cloudflare:node'; 

import usersRouter from './routes/users.js';
import bookingsRouter from './routes/bookings.js';
import dbRouter from './routes/database.js';
import emailRouter from './routes/email.js';
import hotelsRouter from './routes/hotels.js';


const app = express();

const allowedOrigins = [
  'https://luxx.gabrielwkun.workers.dev',
  'https://luxury.gabrielwkun.workers.dev',
  'https://luxx-hotel-api.gabrielwkun.workers.dev',
  'http://localhost:5173',
  'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    const isAllowedWorkerOrigin = origin.startsWith('https://') && origin.endsWith('.gabrielwkun.workers.dev');
    const isAllowedGitHubPages = origin.startsWith('https://') && (origin.endsWith('.github.io') || origin.endsWith('.pages.dev'));
    const isAllowedLocalhost = origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:');
    if (allowedOrigins.indexOf(origin) !== -1 || isAllowedWorkerOrigin || isAllowedGitHubPages || isAllowedLocalhost) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

app.use((req, _res, next) => {
  // Properly retrieve the Cloudflare environment
  // Priority: req.env (set by fetch handler) > req.raw.env > globalThis.__LUXX_ENV
  const env = req.env || globalThis.__LUXX_ENV;

  if (!env) {
    console.warn('Warning: Cloudflare env not available on request');
  }

  req.env = env;
  req.db = env?.HOTELS_DB;
  req.JWT_SECRET = env?.JWT_SECRET || 'luxx-development-secret-change-me';

  next();
});

app.use('/', usersRouter);
app.use('/', dbRouter);
app.use('/bookings', bookingsRouter);
app.use('/email', emailRouter);
app.use('/', hotelsRouter);


// Debug endpoint to check database connection
app.get('/health', (req, res) => {
  const hasDb = !!req.db;
  const hasEnv = !!req.env;
  const dbType = req.db?.constructor?.name || 'unknown';
  
  return res.status(hasDb ? 200 : 500).json({
    status: hasDb ? 'healthy' : 'unhealthy',
    database: {
      available: hasDb,
      type: dbType,
      binding: 'HOTELS_DB'
    },
    environment: {
      available: hasEnv,
      envKeys: hasEnv ? Object.keys(req.env).filter(k => !k.includes('SECRET') && !k.includes('KEY')) : []
    }
  });
});

app.get('/home', (req, res) => {
  res.send('hello,world');
});

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

const handler = httpServerHandler(server);

export default {
  async fetch(request, env, ctx) {
    // Attach Cloudflare environment to the request so middleware can access it
    globalThis.__LUXX_ENV = env;
    request.env = env;
    request.ctx = ctx;
    
    return handler.fetch(request, env, ctx);
  }
};




