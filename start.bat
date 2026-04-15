@echo off
cd /d "%~dp0"

echo Pulling latest updates from GitHub...
git pull
if errorlevel 1 (
  echo Failed to pull latest updates. Fix git issues and try again.
  pause
  exit /b 1
)

echo Starting Cosmo Server...
start "Cosmo Server" cmd /k "set COOKIE_SECURE=1&& set CORS_ORIGINS=https://gorgeborger-rgb.github.io&& set STATUS_PASSWORD=support&& node server.js"

echo Starting Tunnel (copy the URL from here)...
start "Cosmo Tunnel" cmd /k "cloudflared tunnel --url http://127.0.0.1:5000 --no-autoupdate"

echo.
echo Keep BOTH windows open!
echo.
