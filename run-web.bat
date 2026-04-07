@echo off
setlocal
cd /d "%~dp0"

set "COOKIE_SECURE=1"
set "CORS_ORIGINS=https://gorgeborger2-byte.github.io"

echo [cosmo-web] Starting server on port 5000...
:web_loop
node server.js
echo [cosmo-web] Server exited. Restarting in 2 seconds...
timeout /t 2 /nobreak >nul
goto web_loop
