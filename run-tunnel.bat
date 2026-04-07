@echo off
setlocal

echo [cosmo-tunnel] Starting Cloudflare quick tunnel to 127.0.0.1:5000...
echo [cosmo-tunnel] Copy the https://*.trycloudflare.com URL shown below.
:tunnel_loop
cloudflared tunnel --url http://127.0.0.1:5000 --no-autoupdate --metrics 127.0.0.1:20301
echo [cosmo-tunnel] Tunnel exited. Restarting in 2 seconds...
timeout /t 2 /nobreak >nul
goto tunnel_loop
