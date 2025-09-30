# Cloudflare Web Analytics Setup

## 📊 Setting up Web Analytics for kabirsantsharan.com

### Step 1: Create Analytics Site in Cloudflare Dashboard

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Analytics & Logs** → **Web Analytics**
3. Click **Add a site**
4. Enter site details:
   - **Site name**: Kabir Sant Sharan
   - **Hostname**: kabirsantsharan.com
5. Click **Add site**
6. Copy the **Beacon Token** provided

### Step 2: Update the Application

Once you have the beacon token, update the analytics configuration:

```typescript
// In src/app/layout.tsx, replace line 136:
data-cf-beacon='{"token": "YOUR_ACTUAL_BEACON_TOKEN"}'
```

### Step 3: Deploy Changes

```bash
npm run build
npx wrangler pages deploy out --project-name=kabir-sant-sharan
```

### Expected Analytics Features

Once configured, you'll get:
- **Page views** and **unique visitors**
- **Traffic sources** and **referrers**
- **Geographic data** of visitors
- **Device and browser analytics**
- **Performance metrics** (Core Web Vitals)
- **Real-time traffic monitoring**

### Manual Setup Alternative

If you prefer manual setup:
1. Visit [Cloudflare Web Analytics](https://www.cloudflare.com/web-analytics/)
2. Sign in with your Cloudflare account
3. Add kabirsantsharan.com as a new site
4. Get the beacon token
5. Update the code as shown above

## 🔧 Benefits

- **Privacy-focused**: No cookies, GDPR compliant
- **Lightweight**: <1KB script
- **Real-time data**: Live visitor tracking
- **Free tier**: Unlimited pageviews for personal sites
- **Integration**: Works with Cloudflare security features