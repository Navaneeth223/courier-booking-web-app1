# Deployment Guide

## Prerequisites
- VPS (Ubuntu 20.04+ recommended)
- Node.js 18+
- MongoDB instance (local or Atlas)
- Redis server (for Bull queue)
- Nginx

## Backend Deployment (PM2)
1. Clone the repo to `/var/www/courier-app`.
2. Install dependencies: `cd backend && npm install --production`.
3. Create `.env` with production values.
4. Start with PM2: `pm2 start server.js --name "courier-backend"`.

## Frontend Deployment (Nginx)
1. Build the app: `cd frontend && npm run build`.
2. Copy `dist/` to `/var/www/courier-app/frontend`.
3. Configure Nginx:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        root /var/www/courier-app/frontend;
        index index.html;
        try_files $uri /index.html;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## SSL Setup
Use Certbot for Let's Encrypt:
```bash
sudo certbot --nginx -d yourdomain.com
```

## Backups
- **MongoDB**: Use `mongodump` via a daily cron job.
- **Logs**: PM2 logs can be managed with `pm2-logrotate`.
