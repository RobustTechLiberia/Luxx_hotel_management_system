@echo off
REM Quick Start - Frontend Server
REM This script starts the Vite dev server

title Frontend Server - Luxx Hotel System  
color 0A

cd /d "%~dp0"
echo.
echo ============================================
echo   STARTING FRONTEND SERVER (VITE)
echo ============================================
echo.
echo Installing dependencies...
cmd /c "npm install"

echo.
echo ✅ Frontend will start in 2 seconds...
echo.
echo Access at: http://localhost:5173
echo.
echo Note: Backend server must be running on http://localhost:3000
echo        Run START_BACKEND.bat in another terminal first!
echo.
echo Press CTRL+C to stop the server.
echo.
timeout /t 2 /nobreak

cmd /c "npm run dev"
pause
