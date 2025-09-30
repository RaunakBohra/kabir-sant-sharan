# 🚀 Kabir Sant Sharan - Cloudflare Deployment Guide

## ✅ **Configuration Fixed**

I've fixed the wrangler.toml configuration error and updated Next.js for static export. Your project is now ready for deployment!

## 🔧 **Pre-Deployment Setup**

### Step 1: Login to Cloudflare
```bash
npx wrangler login
```
This will open your browser to authenticate with Cloudflare.

### Step 2: Create D1 Database
```bash
# Create the D1 database
npx wrangler d1 create kabir-sant-sharan

# Copy the database ID from the output and update your .env.local
```

Example output:
```
✅ Successfully created DB 'kabir-sant-sharan'

[[d1_databases]]
binding = "DB"
database_name = "kabir-sant-sharan"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"  # Copy this ID
```

### Step 3: Update Configuration Files

**Update `.env.local`:**
```bash
CLOUDFLARE_DATABASE_ID=your-actual-database-id-here
```

**Update `wrangler.toml`:**
```toml
[[d1_databases]]
binding = "DB"
database_name = "kabir-sant-sharan"
database_id = "your-actual-database-id-here"  # Replace with real ID
```

## 📊 **Database Setup**

### Step 4: Generate and Apply Database Schema
```bash
# Generate Drizzle migrations
npm run db:generate

# Apply schema to local D1 (for development)
npx wrangler d1 migrations apply kabir-sant-sharan --local

# Apply schema to remote D1 (for production)
npx wrangler d1 migrations apply kabir-sant-sharan --remote
```

### Step 5: Seed Database with Sample Data
```bash
# Run the migration script to populate sample spiritual content
npx wrangler d1 execute kabir-sant-sharan --remote --file=./drizzle/seed.sql
```

## 🎵 **Media Storage Setup**

### Step 6: Create R2 Buckets
```bash
# Create production bucket
npx wrangler r2 bucket create kabir-media

# Create development bucket
npx wrangler r2 bucket create kabir-media-dev
```

## 🌐 **Website Deployment**

### Step 7: Build and Deploy
```bash
# Build the static site
npm run build

# Deploy to Cloudflare Pages
npx wrangler pages deploy out --project-name kabir-sant-sharan
```

### Step 8: Configure Custom Domain (Optional)
```bash
# Add your custom domain
npx wrangler pages domain add kabir-sant-sharan your-domain.com
```

## ⚙️ **Environment Variables for Production**

In Cloudflare Pages dashboard, add these environment variables:

```bash
CLOUDFLARE_API_TOKEN=549ca7e72bd59643a845d021290e3c512c8d4
CLOUDFLARE_ACCOUNT_ID=7e506c3c49803094e72145796c0f8598
CLOUDFLARE_ZONE_ID=b03ddeae4205f74fd88f4e746c9d829d
CLOUDFLARE_DATABASE_ID=your-actual-d1-database-id
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_SITE_NAME=Kabir Sant Sharan
```

## 🔍 **Verify Deployment**

### Check D1 Database
```bash
# List your databases
npx wrangler d1 list

# Query your database
npx wrangler d1 execute kabir-sant-sharan --remote --command="SELECT * FROM quotes LIMIT 5"
```

### Check R2 Storage
```bash
# List your buckets
npx wrangler r2 bucket list
```

### Check Pages Deployment
```bash
# List your pages projects
npx wrangler pages project list
```

## 🎯 **Post-Deployment Tasks**

### 1. Test Website Functionality
- ✅ Homepage loads correctly
- ✅ Navigation works on mobile/desktop
- ✅ Language switcher functions
- ✅ Contact forms submit properly
- ✅ Newsletter signup works
- ✅ Media players function correctly

### 2. Configure Analytics
```bash
# Enable Cloudflare Web Analytics
npx wrangler pages deployment tail kabir-sant-sharan
```

### 3. Setup Custom Domain
1. Go to Cloudflare Pages dashboard
2. Add your custom domain
3. Update DNS settings
4. Enable SSL/TLS

## 🚨 **Common Issues & Solutions**

### Issue: Database ID Not Found
**Solution**: Make sure to update both `.env.local` and `wrangler.toml` with the actual database ID from Step 2.

### Issue: Build Fails
**Solution**:
```bash
# Clear Next.js cache
rm -rf .next
rm -rf out

# Reinstall dependencies
npm ci

# Try building again
npm run build
```

### Issue: Pages Deployment Fails
**Solution**:
```bash
# Check build output exists
ls -la out/

# Deploy with verbose logging
npx wrangler pages deploy out --project-name kabir-sant-sharan --compatibility-date=2024-09-29
```

## 📊 **Expected Costs (FREE TIER)**

- **Cloudflare D1**: 5GB storage, 25M reads/month - **$0**
- **Cloudflare Workers**: 100k requests/day - **$0**
- **Cloudflare R2**: 10GB storage, 1M operations/month - **$0**
- **Cloudflare Pages**: Unlimited bandwidth - **$0**
- **Total Monthly Cost**: **$0** 🎉

## 🎉 **Success!**

Once deployed, your Kabir Sant Sharan spiritual website will be:
- ✅ **Live globally** with Cloudflare's edge network
- ✅ **Zero operational costs** on free tiers
- ✅ **Mobile-optimized** with A+ responsiveness
- ✅ **Multilingual** (English/Nepali/Hindi)
- ✅ **Professional design** with spiritual authenticity
- ✅ **Lightning fast** with edge caching

## 📞 **Support**

If you encounter any issues:
1. Check Cloudflare Pages build logs
2. Verify D1 database connection
3. Test R2 bucket access
4. Confirm environment variables are set

Your spiritual website honoring Sant Kabir Das's teachings is ready to inspire seekers worldwide! 🙏

---
*Deployment guide for the Kabir Sant Sharan spiritual website*