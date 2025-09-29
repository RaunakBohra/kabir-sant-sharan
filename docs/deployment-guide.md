# Deployment Guide

This guide covers deploying the Kabir Sant Sharan platform to various environments, from development to production.

## Quick Deployment Options

### Option 1: Vercel (Recommended)
Best for Next.js applications with serverless functions.

### Option 2: Cloudflare Pages
Great for static sites with edge computing capabilities.

### Option 3: Docker Container
Ideal for VPS, dedicated servers, or cloud providers.

### Option 4: Traditional Hosting
For shared hosting or custom server setups.

## Prerequisites

Before deploying, ensure you have:

- Node.js 18.17 or later
- Git repository with your code
- Environment variables configured
- Database setup (if using external database)
- Domain name (optional but recommended)

## Environment Setup

### 1. Clone and Setup

```bash
git clone https://github.com/your-username/kabir-sant-sharan.git
cd kabir-sant-sharan
npm install
```

### 2. Configure Environment Variables

Create environment files for each environment:

```bash
# Development
cp .env.example .env.local

# Production
cp .env.example .env.production
```

Required environment variables:
```bash
# Database
DATABASE_URL="your-database-connection-string"

# Authentication
JWT_SECRET="your-super-secure-jwt-secret-key"
JWT_REFRESH_SECRET="your-super-secure-refresh-secret-key"
JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# Admin Credentials
ADMIN_EMAIL="admin@kabirsantsharan.com"
ADMIN_PASSWORD_HASH="$2a$12$your-bcrypt-hashed-password"

# Rate Limiting
RATE_LIMIT_ENABLED="true"
RATE_LIMIT_WINDOW_MS="900000"
RATE_LIMIT_MAX_REQUESTS="100"

# Security
ALLOWED_ORIGINS="https://your-domain.com,https://www.your-domain.com"
SESSION_SECRET="your-session-secret-key"

# Monitoring (Optional)
PERFORMANCE_ENABLED="true"
ERROR_TRACKING_ENABLED="true"

# External Services (Optional)
SMTP_HOST="your-smtp-host"
SMTP_PORT="587"
SMTP_USER="your-smtp-user"
SMTP_PASS="your-smtp-password"
```

## Deployment Methods

## 🚀 Method 1: Vercel Deployment (Recommended)

Vercel provides the best Next.js hosting experience with automatic deployments.

### Setup

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Configuration

Create `vercel.json` in your project root:

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "functions": {
    "src/app/api/**/*.ts": {
      "runtime": "nodejs18.x"
    }
  },
  "regions": ["iad1"],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### Environment Variables

Add environment variables in Vercel dashboard:
1. Go to your project in Vercel dashboard
2. Navigate to Settings → Environment Variables
3. Add all required variables for Production environment

### Database Setup

**Option A: Vercel Postgres**
```bash
vercel postgres create
```

**Option B: External Database**
- Use Supabase, PlanetScale, or any PostgreSQL provider
- Update `DATABASE_URL` in environment variables

### Custom Domain

1. Go to Vercel dashboard → Your Project → Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed
4. SSL certificate is automatic

## 🌐 Method 2: Cloudflare Pages

Excellent for static sites with edge computing capabilities.

### Setup

1. **Install Wrangler CLI**
   ```bash
   npm install -g wrangler
   ```

2. **Login to Cloudflare**
   ```bash
   wrangler login
   ```

3. **Configure for static export**

   Update `next.config.js`:
   ```javascript
   /** @type {import('next').NextConfig} */
   const nextConfig = {
     output: 'export',
     trailingSlash: true,
     images: {
       unoptimized: true
     }
   }

   module.exports = nextConfig
   ```

4. **Build and Deploy**
   ```bash
   npm run build
   wrangler pages deploy out --project-name=kabir-sant-sharan
   ```

### Cloudflare D1 Database

1. **Create D1 Database**
   ```bash
   wrangler d1 create kabir-sant-sharan
   ```

2. **Configure wrangler.toml**
   ```toml
   name = "kabir-sant-sharan"
   compatibility_date = "2024-01-01"

   [[d1_databases]]
   binding = "DB"
   database_name = "kabir-sant-sharan"
   database_id = "your-database-id"
   ```

3. **Run Migrations**
   ```bash
   wrangler d1 migrations apply kabir-sant-sharan
   ```

### Environment Variables

Set variables in Cloudflare dashboard:
1. Go to Cloudflare Pages → Your Project → Settings → Environment Variables
2. Add production environment variables

## 🐳 Method 3: Docker Deployment

Perfect for VPS, cloud providers, or container orchestration.

### Dockerfile

Create `Dockerfile` in project root:

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine AS runner

WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:password@db:5432/kabir_sant_sharan
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: kabir_sant_sharan
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - /etc/ssl/certs:/etc/ssl/certs
    depends_on:
      - app
    restart: unless-stopped

volumes:
  postgres_data:
```

### Nginx Configuration

Create `nginx.conf`:

```nginx
events {
    worker_connections 1024;
}

http {
    upstream app {
        server app:3000;
    }

    server {
        listen 80;
        server_name your-domain.com www.your-domain.com;
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name your-domain.com www.your-domain.com;

        ssl_certificate /etc/ssl/certs/your-domain.com.crt;
        ssl_certificate_key /etc/ssl/certs/your-domain.com.key;

        location / {
            proxy_pass http://app;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
```

### Deployment Commands

```bash
# Build and run
docker-compose up -d

# View logs
docker-compose logs -f app

# Update application
docker-compose pull
docker-compose up -d --force-recreate

# Backup database
docker-compose exec db pg_dump -U user kabir_sant_sharan > backup.sql
```

## 🖥️ Method 4: Traditional VPS/Server

For traditional hosting environments.

### Prerequisites

- Ubuntu 20.04 LTS or similar
- Node.js 18+ installed
- Nginx or Apache
- PostgreSQL or SQLite
- PM2 process manager

### Server Setup

1. **Update System**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

2. **Install Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Install PM2**
   ```bash
   sudo npm install -g pm2
   ```

4. **Install PostgreSQL**
   ```bash
   sudo apt install postgresql postgresql-contrib
   sudo -u postgres createdb kabir_sant_sharan
   ```

### Application Deployment

1. **Clone Repository**
   ```bash
   cd /var/www
   sudo git clone https://github.com/your-username/kabir-sant-sharan.git
   cd kabir-sant-sharan
   ```

2. **Install Dependencies**
   ```bash
   sudo npm install
   ```

3. **Configure Environment**
   ```bash
   sudo cp .env.example .env.production
   sudo nano .env.production
   ```

4. **Build Application**
   ```bash
   sudo npm run build
   ```

5. **Setup Database**
   ```bash
   sudo npm run db:init
   ```

6. **Start with PM2**
   ```bash
   sudo pm2 start npm --name "kabir-sant-sharan" -- start
   sudo pm2 startup
   sudo pm2 save
   ```

### Nginx Configuration

Create `/etc/nginx/sites-available/kabir-sant-sharan`:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/kabir-sant-sharan /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### SSL with Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

## Database Migrations

For production deployments, always run migrations:

```bash
# Check migration status
npm run db:status

# Run pending migrations
npm run db:migrate

# Seed with production data (optional)
npm run db:seed --env=production
```

## Monitoring and Maintenance

### Health Checks

Set up health check endpoints:
- `GET /api/v1/health` - Application health
- `GET /api/v1/metrics` - Application metrics

### Log Management

**PM2 Logs:**
```bash
pm2 logs kabir-sant-sharan
pm2 logs --lines 100
```

**Docker Logs:**
```bash
docker-compose logs -f app
```

### Backup Strategy

**Database Backup:**
```bash
# PostgreSQL
pg_dump kabir_sant_sharan > backup_$(date +%Y%m%d_%H%M%S).sql

# SQLite
cp database.sqlite backup_$(date +%Y%m%d_%H%M%S).sqlite
```

**Application Backup:**
```bash
tar -czf app_backup_$(date +%Y%m%d_%H%M%S).tar.gz /var/www/kabir-sant-sharan
```

### Performance Optimization

1. **Enable Gzip Compression**
2. **Set up CDN (Cloudflare)**
3. **Optimize Images**
4. **Enable Database Query Optimization**
5. **Monitor with Built-in Performance Dashboard**

## Security Considerations

### Firewall Configuration

```bash
# UFW setup
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

### Regular Updates

```bash
# System updates
sudo apt update && sudo apt upgrade

# Application updates
cd /var/www/kabir-sant-sharan
sudo git pull
sudo npm install
sudo npm run build
sudo pm2 restart kabir-sant-sharan
```

### Security Headers

Ensure security headers are configured (handled by the application):
- Content Security Policy
- X-Frame-Options
- X-Content-Type-Options
- Referrer-Policy

## Troubleshooting

### Common Issues

**Build Errors:**
- Check Node.js version compatibility
- Clear npm cache: `npm cache clean --force`
- Delete node_modules and reinstall

**Database Connection:**
- Verify DATABASE_URL format
- Check database server status
- Validate credentials

**Performance Issues:**
- Monitor with `/admin/performance`
- Check system resources
- Review application logs

**SSL Issues:**
- Verify certificate installation
- Check certificate expiration
- Validate DNS configuration

### Getting Help

1. Check application logs
2. Review performance dashboard
3. Verify environment variables
4. Test database connectivity
5. Check system resources

## Post-Deployment Checklist

- [ ] Application loads successfully
- [ ] Admin login works
- [ ] Database migrations completed
- [ ] SSL certificate active
- [ ] Performance monitoring active
- [ ] Backup strategy implemented
- [ ] Monitoring alerts configured
- [ ] Security headers verified
- [ ] SEO meta tags working
- [ ] Mobile responsiveness tested

## Scaling Considerations

### Horizontal Scaling

- Load balancer configuration
- Session store externalization
- Database read replicas
- CDN implementation

### Vertical Scaling

- Server resource monitoring
- Database optimization
- Memory usage optimization
- CPU usage monitoring

---

*May this platform serve seekers worldwide with reliability and grace. 🕉️*