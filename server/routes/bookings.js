import express from 'express';
import bookingRouter from './routes/bookings.js';

const app = express();

// 1. Bulletproof Native CORS Handling
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  next();
});

// 2. Body Parsing Middleware
app.use(express.json());

// 3. Mount Router
app.use('/', bookingRouter);

// 4. Global Error Catch-All (Linter Compliant)
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, _next) => {
  console.error("Global Server Failure:", err);
  return res.status(500).json({
    success: false,
    error: "Internal Server Error Environment Exception",
    details: err.message
  });
});

// 5. Native Cloudflare Workers Export Handler Interface
export default {
  async fetch(request, env, ctx) {
    // This injects the live Cloudflare context directly into the express request pipeline
    app.request.cloudflare = { env, ctx };
    
    // Fallback bindings 
    if (!app.request.context) app.request.context = {};
    app.request.context.env = env;
    app.request.context.ctx = ctx;
    
    // Globally bind for internal scope operations
    globalThis.env = env;

    return app(request, env, ctx);
  }
};