# Cloudflare Deployment Guide - Kabir Sant Sharan

## Prerequisites
- Cloudflare account
- GitHub repository with latest code
- Wrangler CLI installed (`npm install -g wrangler`)

## Step 1: Set Up Cloudflare D1 Database

```bash
# Login to Cloudflare
wrangler login

# Create D1 database
wrangler d1 create kabir-sant-sharan-db

# Note the database_id from the output - you'll need this

# Apply schema
wrangler d1 execute kabir-sant-sharan-db --file=./d1-schema.sql
```

## Step 2: Configure Environment Variables in Cloudflare

Go to your Cloudflare Pages project → Settings → Environment Variables

### Required Variables for Production:

```bash
# JWT Configuration (IMPORTANT: Generate new secrets for production!)
JWT_SECRET=<generate-random-64-char-string>
JWT_REFRESH_SECRET=<generate-random-64-char-string>
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Admin Configuration
ADMIN_EMAIL=admin@kabirsantsharan.com
ADMIN_PASSWORD_HASH=$2b$12$NNnKjCgp2n1L2eYtLARZoOHYIrDfqMYyBgJFCFnTU6.zAlZsAGglO

# Rate Limiting
RATE_LIMIT_AUTH_MAX=5
RATE_LIMIT_AUTH_WINDOW=60000
RATE_LIMIT_API_MAX=100
RATE_LIMIT_API_WINDOW=900000

# Security
CORS_ORIGIN=https://kabirsantsharan.com,https://www.kabirsantsharan.com
BCRYPT_SALT_ROUNDS=12

# Environment
NODE_ENV=production
ENVIRONMENT=production

# Logging
LOG_LEVEL=error
```

### How to Generate Secure JWT Secrets:

```bash
# Generate JWT_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Generate JWT_REFRESH_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### How to Generate Password Hash (if you want to change admin password):

```bash
# Install bcryptjs
npm install bcryptjs

# Generate hash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('YOUR_NEW_PASSWORD', 12, (err, hash) => { console.log(hash); });"
```

## Step 3: Set Environment Variables via Wrangler

```bash
# Set secrets one by one
wrangler pages secret put JWT_SECRET
wrangler pages secret put JWT_REFRESH_SECRET
wrangler pages secret put ADMIN_PASSWORD_HASH

# Or use bulk commands
echo "your-jwt-secret-here" | wrangler pages secret put JWT_SECRET
echo "your-refresh-secret-here" | wrangler pages secret put JWT_REFRESH_SECRET
```

## Step 4: Update wrangler.toml

Create or update `wrangler.toml` in your project root:

```toml
name = "kabir-sant-sharan"
compatibility_date = "2024-09-29"

[env.production]
name = "kabir-sant-sharan"

[[env.production.d1_databases]]
binding = "DB"
database_name = "kabir-sant-sharan-db"
database_id = "YOUR_DATABASE_ID_HERE"  # From Step 1

[build]
command = "npm run build"
```

## Step 5: Deploy to Cloudflare Pages

### Option A: Deploy via GitHub Integration (Recommended)

1. Go to Cloudflare Dashboard → Pages
2. Click "Create a project" → "Connect to Git"
3. Select your GitHub repository
4. Configure build settings:
   - **Build command**: `npm run build`
   - **Build output directory**: `.next`
   - **Root directory**: `/` (leave blank)
   - **Framework preset**: Next.js

5. Add environment variables (from Step 2)
6. Click "Save and Deploy"

### Option B: Deploy via Wrangler CLI

```bash
# Build the project
npm run build

# Deploy
wrangler pages deploy .next --project-name=kabir-sant-sharan

# Deploy with specific branch
wrangler pages deploy .next --project-name=kabir-sant-sharan --branch=main
```

## Step 6: Configure Custom Domain

1. Go to Cloudflare Dashboard → Pages → Your Project
2. Click "Custom domains"
3. Add your domain (e.g., kabirsantsharan.com)
4. Cloudflare will automatically configure DNS if your domain is on Cloudflare

## Step 7: Verify Deployment

### Test Admin Login:
```
URL: https://kabirsantsharan.com/login
Email: admin@kabirsantsharan.com
Password: admin123 (or your new password)
```

### Test API Endpoints:
```bash
# Test teachings API
curl https://kabirsantsharan.com/api/teachings?limit=3

# Test events API
curl https://kabirsantsharan.com/api/events?limit=3

# Test daily quote API
curl https://kabirsantsharan.com/api/quotes/daily

# Test newsletter subscription
curl -X POST https://kabirsantsharan.com/api/newsletter/subscribers \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User","preferences":{"teachings":true,"events":true,"meditation":false}}'
```

## Step 8: Monitor Deployment

### View Logs:
```bash
# Stream logs
wrangler pages deployment tail

# View specific deployment
wrangler pages deployment list
```

### Check Analytics:
- Go to Cloudflare Dashboard → Pages → Your Project → Analytics
- Monitor page views, visitors, and API requests

## Troubleshooting

### Issue: Database connection error
**Solution**: Verify D1 database binding in wrangler.toml matches your database_id

### Issue: JWT errors
**Solution**: Ensure JWT_SECRET and JWT_REFRESH_SECRET are set correctly in environment variables

### Issue: 500 errors on API routes
**Solution**: Check Wrangler logs (`wrangler pages deployment tail`) for detailed error messages

### Issue: Build fails
**Solution**:
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `npm install`
- Try building locally first: `npm run build`

## Security Checklist Before Going Live

- [ ] Change default admin password
- [ ] Generate new JWT secrets (don't use example values)
- [ ] Update CORS_ORIGIN to your actual domain
- [ ] Set NODE_ENV=production
- [ ] Enable HTTPS only (Cloudflare handles this automatically)
- [ ] Review rate limiting settings
- [ ] Set up monitoring/alerting
- [ ] Create database backups

## Current Admin Credentials (CHANGE THESE!)

```
Email: admin@kabirsantsharan.com
Password: admin123
```

**IMPORTANT**: After first login, go to Settings and change these credentials!

## Database Schema

The database schema is in `d1-schema.sql` with these tables:
- `blog_posts` - Spiritual teachings/blog content
- `events` - Community events and satsangs
- `quotes` - Daily wisdom quotes
- `media_content` - Audio/video spiritual content
- `user_profiles` - User accounts
- `newsletter_subscribers` - Email subscribers
- `newsletter_campaigns` - Email campaigns
- `analytics_page_views` - Page view tracking
- `analytics_visitors` - Visitor session data

## API Endpoints Summary

### Public Endpoints:
- `GET /api/teachings` - Get spiritual teachings
- `GET /api/events` - Get upcoming events
- `GET /api/quotes/daily` - Get daily quote
- `GET /api/search` - Search content
- `POST /api/newsletter/subscribers` - Subscribe to newsletter

### Protected Endpoints (require admin auth):
- `GET /api/newsletter/subscribers` - List all subscribers
- `GET /api/newsletter/campaigns` - List campaigns
- `POST /api/newsletter/campaigns` - Create/send campaign
- `GET /api/analytics/overview` - Analytics data
- `GET /api/analytics/top-pages` - Top pages report
- `GET /api/analytics/recent-activity` - Recent activity

### Auth Endpoints:
- `POST /api/auth/login` - Admin login
- `GET /api/auth/verify` - Verify token

## Next Steps After Deployment

1. **Content Management**: Login to `/admin` and start adding real content
2. **SEO Setup**: Add meta tags, sitemap.xml, robots.txt
3. **Analytics**: Set up Cloudflare Web Analytics
4. **Monitoring**: Configure uptime monitoring
5. **Backups**: Set up automated D1 database backups
6. **CDN**: Leverage Cloudflare's global CDN (automatic)

## Support

For issues or questions:
- Check Cloudflare Pages docs: https://developers.cloudflare.com/pages/
- Check D1 docs: https://developers.cloudflare.com/d1/
- Review project README.md