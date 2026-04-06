module.exports = {
  apps: [
    {
      name: 'cosmo-web',
      script: 'server.js',
      cwd: __dirname,
      instances: 1,
      autorestart: true,
      watch: false,
      max_restarts: 10,
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      }
    },
    {
      name: 'cosmo-scraper',
      script: 'scraper.py',
      cwd: __dirname,
      interpreter: 'python',
      instances: 1,
      autorestart: true,
      watch: false,
      max_restarts: 10
    }
  ]
};
