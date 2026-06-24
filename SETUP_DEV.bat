@echo off
REM Complete setup for Luxx Hotel Management System (Windows)
setlocal enabledelayedexpansion

echo ========================================
echo Luxx Hotel Management System - Dev Setup
echo ========================================
echo.

REM Get the script directory
set SCRIPT_DIR=%~dp0

REM Step 1: Install root dependencies
echo 📦 Step 1: Installing root dependencies...
cd /d "%SCRIPT_DIR%"
for /f "delims=" %%A in ('where npm') do (
    %%A install --silent
)

REM Step 2: Install backend dependencies  
echo 📦 Step 2: Installing backend dependencies...
cd /d "%SCRIPT_DIR%server"
for /f "delims=" %%A in ('where npm') do (
    %%A install --silent
)

REM Step 3: Build frontend
echo 🏗️  Step 3: Building frontend...
cd /d "%SCRIPT_DIR%"
for /f "delims=" %%A in ('where npm') do (
    %%A run build
)

echo.
echo ========================================
echo ✅ Setup complete!
echo ========================================
echo.
echo To start development:
echo.
echo Terminal 1 - Backend (D1 Database):
echo   cd server
echo   npm run dev
echo   (will run on http://localhost:3000)
echo.
echo Terminal 2 - Frontend (Vite Dev Server):
echo   npm run dev
echo   (will run on http://localhost:5173)
echo.
echo Then:
echo 1. Open http://localhost:5173 in your browser
echo 2. Navigate to /signup
echo 3. Create an account - it will save to D1 database
echo.
pause
