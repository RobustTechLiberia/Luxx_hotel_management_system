/* eslint-disable no-undef */
import express from 'express';
import cors from 'cors';
import { httpServerHandler } from 'cloudflare:node'; 

import dbRouter from './routes/database.js';

const app = express();

const allowedOrigins = [
  'https://luxx.gabrielwkun.workers.dev', 
  'http://localhost:5173',               
  'http://localhost:3000'                
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

app.use("/", dbRouter);

app.get("/home", (req, res) => {
  res.send("hello,world");
});

const port = process.env.PORT || 3000;
const server = app.listen(port); 

const handler = httpServerHandler(server);

export default {
  async fetch(request, env, ctx) {
    request.env = env; 
    request.ctx = ctx;
    return handler.fetch(request, env, ctx);
  }
};