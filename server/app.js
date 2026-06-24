/* eslint-disable no-undef */
import express from 'express';
import cors from 'cors';
import { httpServerHandler } from 'cloudflare:node'; 

import usersRouter from './routes/users.js';
import bookingsRouter from './routes/bookings.js';
import dbRouter from './routes/database.js';
import emailRouter from './routes/email.js';

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
  const env = req.raw?.env || req.env || globalThis.__LUXX_ENV;

  req.env = env;
  req.db = env?.HOTELS_DB || env?.DB;
  req.JWT_SECRET = env?.JWT_SECRET || 'luxx-development-secret-change-me';

  next();
});

app.use('/', usersRouter);
app.use('/', dbRouter);
app.use('/bookings', bookingsRouter);
app.use('/email', emailRouter);

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
    globalThis.__LUXX_ENV = env;
    request.env = env; 
    request.ctx = ctx;
    return handler.fetch(request, env, ctx);
  }
};




