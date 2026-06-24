@echo off
REM Start the Cloudflare Wrangler dev server for backend
cd /d "%~dp0"
echo Starting backend server on http://localhost:3000...
cd server
where /q wrangler
if errorlevel 1 (
    echo Installing wrangler globally...
    call cmd /c "npx wrangler --version"
)
call cmd /c "npm install"
call cmd /c "npm run dev"
