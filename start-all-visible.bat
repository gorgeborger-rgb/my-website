@echo off
setlocal
cd /d "%~dp0"

echo Stopping old node/python/cloudflared processes...
taskkill /IM node.exe /F >nul 2>&1
taskkill /IM python.exe /F >nul 2>&1
taskkill /IM cloudflared.exe /F >nul 2>&1

echo Starting Cosmo services in visible windows...
start "Cosmo Web (5000)" "%ComSpec%" /k call "%~dp0run-web.bat"
start "Cosmo Scraper (5050)" "%ComSpec%" /k call "%~dp0run-scraper.bat"
start "Cosmo Tunnel" "%ComSpec%" /k call "%~dp0run-tunnel.bat"

echo.
echo All windows started.
echo Keep them open to stay online.
echo.
