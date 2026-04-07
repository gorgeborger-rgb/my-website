@echo off
setlocal
cd /d "%~dp0"

echo [cosmo-scraper] Starting scraper on port 5050...
:scraper_loop
python scraper.py
echo [cosmo-scraper] Scraper exited. Restarting in 2 seconds...
timeout /t 2 /nobreak >nul
goto scraper_loop
