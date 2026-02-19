# ILMERA Admin Panel - Deployment Guide

## Prerequisites

- Node.js 16+
- npm or yarn
- Production server (Linux recommended)
- Nginx or Apache for reverse proxy
- SSL certificate (HTTPS)

## Step 1: Build the Application

```bash
cd Admin
npm install
npm run build
```

This creates a `dist/` folder with all static files.

## Step 2: Server Setup

### Option A: Using Nginx

```nginx
server {
    listen 80;
    server_name admin.yourdomain.com;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name admin.yourdomain.com;

    # SSL Configuration
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Root path
    root /var/www/ilmera-admin/dist;
    index index.html;

    # Serve static files
    location ~ ^/assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Route all requests to index.html (SPA)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy
    location /api/ {
        proxy_pass http://backend-server:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Security headers
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
}
```

### Option B: Using Apache

```apache
<VirtualHost *:443>
    ServerName admin.yourdomain.com

    SSLEngine on
    SSLCertificateFile /path/to/certificate.crt
    SSLCertificateKeyFile /path/to/private.key

    DocumentRoot /var/www/ilmera-admin/dist

    <Directory /var/www/ilmera-admin/dist>
        Options -MultiViews
        RewriteEngine On
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteRule ^ index.html [QSA,L]
    </Directory>

    # Cache static assets
    <FilesMatch "\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$">
        Header set Cache-Control "max-age=31536000, public"
    </FilesMatch>

    # API proxy
    ProxyPreserveHost On
    ProxyPass /api http://backend-server:5000/api
    ProxyPassReverse /api http://backend-server:5000/api

    # Security headers
    Header set X-Content-Type-Options "nosniff"
    Header set X-Frame-Options "DENY"
    Header set X-XSS-Protection "1; mode=block"
</VirtualHost>

<VirtualHost *:80>
    ServerName admin.yourdomain.com
    Redirect permanent / https://admin.yourdomain.com/
</VirtualHost>
```

## Step 3: Upload Files

```bash
# Copy build files to server
scp -r dist/* user@server:/var/www/ilmera-admin/
```

## Step 4: Environment Configuration

Create/update `.env.production` on the server:

```env
VITE_API_BASE_URL=https://api.yourdomain.com/api
VITE_API_TIMEOUT=30000
NODE_ENV=production
```

You can also update the environment in your CI/CD pipeline.

## Step 5: Enable HTTPS

### Using Let's Encrypt with Certbot

```bash
# Install certbot
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx

# Generate certificate
sudo certbot certonly --nginx -d admin.yourdomain.com

# Auto-renewal
sudo systemctl enable certbot.timer
```

## Performance Optimization

### 1. Enable Gzip Compression

**Nginx:**

```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss;
gzip_min_length 1000;
gzip_proxied any;
```

**Apache:**

```apache
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/xml
    AddOutputFilterByType DEFLATE text/css text/javascript application/javascript
</IfModule>
```

### 2. Enable Browser Caching

Static assets are cached for 1 year (see Nginx/Apache config above).

### 3. CDN Integration

Consider using CloudFlare or similar CDN for:

- Global content distribution
- DDoS protection
- Automatic HTTPS

## Monitoring & Maintenance

### Health Check

```bash
# Check app is running
curl https://admin.yourdomain.com/

# Check API connectivity
curl https://api.yourdomain.com/api/health
```

### Log Monitoring

```bash
# Nginx logs
tail -f /var/log/nginx/error.log
tail -f /var/log/nginx/access.log

# Apache logs
tail -f /var/log/apache2/error.log
tail -f /var/log/apache2/access.log
```

### Backup & Updates

```bash
# Backup current deployment
tar -czf ilmera-admin-backup-$(date +%Y%m%d).tar.gz /var/www/ilmera-admin/

# Update with new build
npm run build
scp -r dist/* user@server:/var/www/ilmera-admin/
```

## Security Checklist

- [ ] Enable HTTPS with valid SSL certificate
- [ ] Set security headers (X-Content-Type-Options, X-Frame-Options, etc.)
- [ ] Enable GZIP compression
- [ ] Configure CORS properly
- [ ] Update default admin credentials
- [ ] Enable firewall rules
- [ ] Configure rate limiting on API endpoints
- [ ] Set up monitoring and alerts
- [ ] Regular backups enabled
- [ ] Keep dependencies updated

## Docker Deployment (Optional)

### Dockerfile

```dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### docker-compose.yml

```yaml
version: "3.8"
services:
  admin-panel:
    build: .
    ports:
      - "80:80"
    environment:
      - VITE_API_BASE_URL=http://backend:5000/api
    depends_on:
      - backend

  backend:
    image: ilmera-backend:latest
    ports:
      - "5000:5000"
    environment:
      - PORT=5000
      - DATABASE_URL=mongodb://mongo:27017/ilmera
    depends_on:
      - mongo

  mongo:
    image: mongo:latest
    volumes:
      - mongo-data:/data/db

volumes:
  mongo-data:
```

Run with: `docker-compose up -d`

## Troubleshooting

### 404 Errors on Refresh

Ensure your web server rewrites all requests to `index.html`:

- Nginx: `try_files $uri $uri/ /index.html;`
- Apache: `RewriteRule ^ index.html [QSA,L]`

### CORS Issues

Configure backend CORS properly:

```javascript
app.use(
  cors({
    origin: "https://admin.yourdomain.com",
    credentials: true,
  }),
);
```

### Slow Performance

- Check Gzip is enabled
- Verify browser caching headers
- Monitor server resources (CPU, memory)
- Use CDN for static assets

### Session Issues

- Ensure secure cookies: `Secure; SameSite=Strict`
- Check token expiration
- Verify API timeout settings

## Support

For issues, check:

1. Server logs (Nginx/Apache)
2. Browser console (F12 > Console)
3. Network tab (F12 > Network)
4. Backend API logs

---

**Last Updated:** February 10, 2026
