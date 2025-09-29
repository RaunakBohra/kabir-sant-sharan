# Custom Domain Setup for Kabir Sant Sharan

## 🌍 Domain: kabirsantsharan.com

### Method 1: Cloudflare Dashboard (Recommended)

#### Step 1: Add Custom Domain to Pages
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Pages** → **kabir-sant-sharan**
3. Click **Custom domains** tab
4. Click **Set up a custom domain**
5. Enter: `kabirsantsharan.com`
6. Click **Continue** and follow the setup

#### Step 2: Add www Subdomain
1. In the same **Custom domains** section
2. Click **Set up a custom domain** again
3. Enter: `www.kabirsantsharan.com`
4. Click **Continue**

### Method 2: DNS Records (Manual Setup)

If you need to manually create DNS records:

#### Main Domain CNAME
```
Type: CNAME
Name: @ (or kabirsantsharan.com)
Target: kabir-sant-sharan.pages.dev
TTL: Auto
```

#### WWW Subdomain CNAME
```
Type: CNAME
Name: www
Target: kabir-sant-sharan.pages.dev
TTL: Auto
```

### Method 3: CLI Commands

```bash
# Note: These require proper API token permissions

# Add main domain to Pages project
curl -X POST "https://api.cloudflare.com/client/v4/accounts/7e506c3c49803094e72145796c0f8598/pages/projects/kabir-sant-sharan/domains" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{"name":"kabirsantsharan.com"}'

# Add www subdomain to Pages project
curl -X POST "https://api.cloudflare.com/client/v4/accounts/7e506c3c49803094e72145796c0f8598/pages/projects/kabir-sant-sharan/domains" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{"name":"www.kabirsantsharan.com"}'
```

## ✅ Expected Results

Once domains are added:
- **Main site**: https://kabirsantsharan.com
- **WWW redirect**: https://www.kabirsantsharan.com → https://kabirsantsharan.com
- **SSL Certificate**: Auto-provisioned (1-5 minutes)
- **Security Headers**: Already configured
- **Redirects**: HTTP→HTTPS automatic

## 🔧 Verification Steps

1. **DNS Propagation**: Check with `dig kabirsantsharan.com`
2. **SSL Status**: Visit https://kabirsantsharan.com
3. **WWW Redirect**: Test https://www.kabirsantsharan.com
4. **Headers**: Check security headers with online tools

## 🆘 Troubleshooting

- **SSL Pending**: Wait 5-15 minutes for certificate provisioning
- **DNS Issues**: Ensure CNAME points to kabir-sant-sharan.pages.dev
- **404 Errors**: Verify domain is added to Pages project
- **Redirect Issues**: Check _redirects file configuration

## 📞 Support

If you need assistance, the domains are pre-configured in the code with:
- Production URL: https://kabirsantsharan.com
- Security headers enabled
- Redirect rules configured
- SSL enforcement enabled