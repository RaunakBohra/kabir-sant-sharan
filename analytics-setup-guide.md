# Complete Analytics Setup Guide

## 🎯 **Cloudflare Web Analytics Setup**

### Manual Setup (Recommended)
1. **Visit Cloudflare Dashboard**
   - Go to https://dash.cloudflare.com
   - Navigate to **Analytics & Logs** → **Web Analytics**

2. **Add Kabir Sant Sharan Site**
   - Click **"Add a site"**
   - **Site name**: `Kabir Sant Sharan`
   - **Hostname**: `kabirsantsharan.com`
   - Click **"Add site"**

3. **Get Beacon Token**
   - Copy the generated beacon token
   - It will look like: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`

4. **Update Application**
   ```bash
   # Update the token in layout.tsx
   data-cf-beacon='{"token": "YOUR_ACTUAL_TOKEN_HERE"}'
   ```

### Alternative: API Setup
```bash
# If you have API access, use this approach:
curl -X POST "https://api.cloudflare.com/client/v4/accounts/7e506c3c49803094e72145796c0f8598/rum/site_info" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{
    "name": "Kabir Sant Sharan",
    "host": "kabirsantsharan.com",
    "zone_tag": "b03ddeae4205f74fd88f4e746c9d829d",
    "auto_install": true
  }'
```

## 📊 **Expected Analytics Features**

Once configured, you'll get:
- **Real-time visitor tracking**
- **Page view analytics**
- **Geographic visitor data**
- **Device and browser insights**
- **Core Web Vitals metrics**
- **Referrer traffic sources**

## 🔧 **Additional Analytics Options**

### Google Analytics 4 (Optional)
Add GA4 for additional insights:
```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Plausible Analytics (Privacy-Focused)
Alternative privacy-focused option:
```html
<script defer data-domain="kabirsantsharan.com" src="https://plausible.io/js/script.js"></script>
```

## 🎯 **Conversion Tracking**

Track spiritual engagement:
- Newsletter signups
- Event registrations
- Teaching page views
- Audio/video plays
- Contact form submissions

## 📈 **Performance Monitoring**

Monitor Core Web Vitals:
- **LCP** (Largest Contentful Paint)
- **FID** (First Input Delay)
- **CLS** (Cumulative Layout Shift)
- **TTFB** (Time to First Byte)

## 🔒 **Privacy Compliance**

Cloudflare Web Analytics benefits:
- ✅ **No cookies required**
- ✅ **GDPR compliant**
- ✅ **No personal data collection**
- ✅ **Privacy-focused by design**
- ✅ **No user consent required**

## 📋 **Implementation Checklist**

- [ ] Create Web Analytics site in Cloudflare
- [ ] Copy beacon token
- [ ] Update `src/app/layout.tsx` with real token
- [ ] Deploy to production
- [ ] Verify analytics data collection
- [ ] Set up custom events (optional)
- [ ] Configure alerts for traffic spikes

## 🚀 **Deployment**

After updating the token:
```bash
npm run build
npx wrangler pages deploy out --project-name=kabir-sant-sharan
```

The analytics will start collecting data immediately on the live site!