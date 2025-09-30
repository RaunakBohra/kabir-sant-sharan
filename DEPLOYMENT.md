# 🚀 Production Deployment Guide

## Required Cloudflare Credentials

### 1. Cloudflare Account ID
**Location**: Cloudflare Dashboard → Right sidebar
**Format**: `7e506c3c49803094e72145796c0f8598` (already configured)

### 2. Cloudflare API Token
**Required Permissions**:
- `Cloudflare Pages:Edit`
- `Zone:Zone Settings:Read`
- `Zone:Zone:Read`
- `Account:Cloudflare D1:Edit`

**Creation Steps**:
1. Go to [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens)
2. Click "Create Token" → "Custom token"
3. Add the permissions listed above
4. Set Account Resources: `Include - All accounts`
5. Set Zone Resources: `Include - All zones`

### 3. Environment Variables Setup

#### For Local Development (.env.local)
```env
# Add these to your existing .env.local
CLOUDFLARE_ACCOUNT_ID=7e506c3c49803094e72145796c0f8598
CLOUDFLARE_API_TOKEN=[your-api-token]
```

#### For Cloudflare Pages (Production)
Set these in Cloudflare Pages Environment Variables:
```env
# JWT Secrets (generate new ones for production)
JWT_SECRET=[new-production-secret]
JWT_REFRESH_SECRET=[new-production-secret]

# Database
CLOUDFLARE_ACCOUNT_ID=7e506c3c49803094e72145796c0f8598
CLOUDFLARE_API_TOKEN=[your-api-token]

# Admin
ADMIN_EMAIL=admin@kabirsantsharan.com
ADMIN_PASSWORD_HASH=$2b$12$NNnKjCgp2n1L2eYtLARZoOHYIrDfqMYyBgJFCFnTU6.zAlZsAGglO

# R2 Storage
R2_ACCOUNT_ID=7e506c3c49803094e72145796c0f8598
R2_ACCESS_KEY_ID=4546d722fc1d5ec32766ef8213da3e7d
R2_SECRET_ACCESS_KEY=7fcc91cd4f225cbfe48187f0a39eabf1095c9f3de4b16d33bb9acfe9c429ea08
R2_ENDPOINT=https://7e506c3c49803094e72145796c0f8598.r2.cloudflarestorage.com
R2_BUCKET_NAME=kabir-media

# App Configuration
NODE_ENV=production
ENVIRONMENT=production
NEXT_PUBLIC_APP_URL=https://kabirsantsharan.com
NEXT_PUBLIC_SITE_NAME=Kabir Sant Sharan
CORS_ORIGIN=https://kabirsantsharan.com,https://www.kabirsantsharan.com

# Rate Limiting
RATE_LIMIT_AUTH_MAX=5
RATE_LIMIT_AUTH_WINDOW=60000
RATE_LIMIT_API_MAX=100
RATE_LIMIT_API_WINDOW=900000

# Security
BCRYPT_SALT_ROUNDS=12
LOG_LEVEL=info
```

## Database Migration Commands

### 1. Generate Migration Scripts
```bash
npm run db:generate
```

### 2. Deploy Schema to D1 (Production)
```bash
wrangler d1 execute kabir-sant-sharan --remote --file=drizzle/migrations/[latest].sql
```

### 3. Seed Production Database
```bash
wrangler d1 execute kabir-sant-sharan --remote --file=drizzle/seed-d1.sql
```

## Deployment Commands

### 1. Build for Production
```bash
npm run build:pages
```

### 2. Preview Locally
```bash
npm run preview
```

### 3. Deploy to Production
```bash
npm run deploy
```

## Domain Configuration

### 1. Custom Domain Setup
- Domain: `kabirsantsharan.com`
- Media subdomain: `media.kabirsantsharan.com` (R2 custom domain)

### 2. DNS Records
Point your domain to Cloudflare Pages:
- Type: `CNAME`
- Name: `@` or `kabirsantsharan.com`
- Content: `kabir-sant-sharan.pages.dev`

## Post-Deployment Verification

### Essential Checks
- [ ] Homepage loads correctly
- [ ] Login functionality works
- [ ] Admin dashboard accessible
- [ ] Media streaming functional
- [ ] API endpoints responding
- [ ] Database operations working
- [ ] HTTPS certificate active
- [ ] Custom domain resolving

## Troubleshooting

### Common Issues
1. **D1 Connection Failed**: Verify API token permissions
2. **Build Errors**: Ensure all environment variables are set
3. **Media Not Loading**: Check R2 bucket configuration
4. **Authentication Issues**: Verify JWT secrets are properly configured

### Debug Commands
```bash
# Check D1 connection
wrangler d1 execute kabir-sant-sharan --remote --command="SELECT 1"

# View deployment logs
wrangler pages deployment tail

# Test local build
npm run build:pages && npm run preview
```

## Security Notes

⚠️ **Important**:
- Never commit API tokens to version control
- Use different JWT secrets for production
- Regularly rotate API tokens
- Monitor access logs for suspicious activity

## Support

For deployment issues:
1. Check Cloudflare Pages deployment logs
2. Verify all environment variables are set
3. Ensure D1 database is properly migrated
4. Test API endpoints individually

---

**Next Steps**: After obtaining Cloudflare credentials, run the database migration scripts and deploy to production.