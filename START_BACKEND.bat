@echo off
REM Quick Start - Backend Server
REM This script properly starts the backend with D1 database

title Backend Server - Luxx Hotel System
color 0A

cd /d "%~dp0server"
echo.
echo ============================================
echo   STARTING BACKEND SERVER WITH D1 DATABASE
echo ============================================
echo.
echo Checking for wrangler...
cmd /c "where wrangler >nul 2>&1"
if errorlevel 1 (
    echo Installing wrangler globally...
    cmd /c "npm install -g wrangler"
)

echo.
echo Installing dependencies...
cmd /c "npm install"

echo.
echo ✅ Backend will start in 2 seconds...
echo.
echo Access at: http://localhost:3000
echo API Endpoint: http://localhost:3000/signup
echo.
echo Press CTRL+C to stop the server.
echo.
timeout /t 2 /nobreak

cmd /c "npm run dev"
pause
