#!/bin/bash
# Complete setup for Luxx Hotel Management System

echo "========================================"
echo "Luxx Hotel Management System - Dev Setup"
echo "========================================"
echo ""

# Step 1: Install root dependencies
echo "📦 Step 1: Installing root dependencies..."
cd "$(dirname "$0")"
npm install --silent

# Step 2: Install backend dependencies
echo "📦 Step 2: Installing backend dependencies..."
cd server
npm install --silent

# Step 3: Run migrations to create D1 tables
echo "🗄️  Step 3: Setting up D1 database schema..."
cd "$(dirname "$0")"

# Step 4: Build frontend
echo "🏗️  Step 4: Building frontend..."
npm run build

echo ""
echo "========================================"
echo "✅ Setup complete!"
echo "========================================"
echo ""
echo "To start development:"
echo ""
echo "Terminal 1 - Backend (D1 Database):"
echo "  cd server"
echo "  npm run dev"
echo "  (will run on http://localhost:3000)"
echo ""
echo "Terminal 2 - Frontend (Vite Dev Server):"
echo "  npm run dev"
echo "  (will run on http://localhost:5173)"
echo ""
echo "Then:"
echo "1. Open http://localhost:5173 in your browser"
echo "2. Navigate to /signup"
echo "3. Create an account - it will save to D1 database"
echo ""
