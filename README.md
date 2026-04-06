# Cosmo Support Portal

Internal staff portal with login, role-based admin panel, support guide, live status, and command center.

## Features

- Login-only home page (no public registration)
- Role-based access:
  - `support`
  - `trail support`
  - `head support`
  - `Owner`
  - `msd` (full admin privileges)
- Admin panel (Owner/msd only):
  - Create user
  - Remove user
  - Change user password
  - Change user role
- Live status dashboard with freshness indicators:
  - Last updated timestamp
  - Data age
  - Backend health status
- Cosmic animated background (stars + falling stars)

## Local Run

### 1) Install dependencies

```bash
npm install
```

### 2) Run web app

```bash
node server.js
```

### 3) Run scraper service (separate terminal)

```bash
python scraper.py
```

### 4) Open

- Login: `http://localhost:5000/`
- Default seed users:
  - `owner / owner123!`
  - `msd / msd123!`

Change both passwords immediately after first login.

## Health Endpoint

`GET /api/health`

Returns:

- web uptime
- session count
- scraper reachability + latency
- status cache age/staleness

## PM2 Production Setup

This project includes `ecosystem.config.js` for running both services.

### Install PM2 globally

```bash
npm i -g pm2
```

### Start both services

```bash
npm run pm2:start
```

### Useful commands

```bash
npm run pm2:logs
npm run pm2:restart
npm run pm2:stop
npm run pm2:delete
```

### Persist across reboot

```bash
pm2 save
pm2 startup
```

## GitHub Pages + Cloudflare Tunnel (Hybrid)

Use this when frontend is static on GitHub Pages and backend stays on your machine/server through a Cloudflare tunnel.

### 1) Frontend on GitHub Pages

- Push repository to GitHub
- Ensure `.github/workflows/deploy.yml` is enabled
- GitHub Pages serves files from `public/`

### 2) Backend via Cloudflare tunnel

Run backend services locally/server:

```bash
npm run pm2:start
```

Expose backend `http://localhost:5000` through Cloudflare tunnel and note the tunnel URL.

### 3) Configure frontend API base

In browser console on your GitHub Pages site, set:

```js
localStorage.setItem('COSMO_API_BASE', 'https://YOUR-TUNNEL-URL.trycloudflare.com')
location.reload()
```

### 4) Required backend env for cross-origin auth

Set these environment variables before starting server:

```bash
COOKIE_SECURE=1
CORS_ORIGINS=https://YOUR-USERNAME.github.io
```

If your Pages URL is project-based, use that exact origin.

### 5) Verify

- Login works from GitHub Pages domain
- `/api/health` reports scraper reachable
- Status updates show fresh data age

## Cloudflare Cutover Checklist

Use this checklist before pointing production domain.

### A) Server Readiness

- [ ] VPS/server has Node, Python, PM2 installed
- [ ] `npm install` completed
- [ ] `python scraper.py` works locally on server
- [ ] `npm run pm2:start` running both apps
- [ ] `pm2 save` executed
- [ ] `/api/health` returns `success: true`

### B) Security Basics

- [ ] Change default `owner` and `msd` passwords
- [ ] Ensure `data/users.json` is not public
- [ ] Firewall allows only required ports (80/443)
- [ ] Backend runs behind reverse proxy (Nginx recommended)

### C) Domain + Cloudflare

- [ ] Add DNS record (`A` or `CNAME`) to server
- [ ] Enable Cloudflare proxy (orange cloud)
- [ ] SSL/TLS mode: **Full (strict)**
- [ ] Enable Always Use HTTPS
- [ ] Add WAF rules / rate limit for `/api/auth/login`

### D) Validation Before Go-Live

- [ ] Login works for support role
- [ ] Admin panel visible only for Owner/msd
- [ ] Status page shows updating/testing data
- [ ] Status page freshness indicators are updating
- [ ] Logout works and protected pages redirect to login
- [ ] Mobile responsive check passed

### E) Post-Cutover

- [ ] Monitor `pm2 logs`
- [ ] Confirm Cloudflare analytics shows normal traffic
- [ ] Test `/api/health` every few minutes first hour
